import { Server } from 'socket.io';
import http from 'http';
import cookie from 'cookie';
import { createAdapter } from '@socket.io/redis-adapter';
import Redis from 'ioredis';
import pool from '../config/db';
import { verifyToken, JwtPayload } from '../config/auth';

export const setupSocket = (server: http.Server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  const redisHost = process.env.REDIS_HOST || 'localhost';
  const redisPort = parseInt(process.env.REDIS_PORT || '6379');

  const pubClient = new Redis({ host: redisHost, port: redisPort });
  const subClient = pubClient.duplicate();

  io.adapter(createAdapter(pubClient, subClient));

  // Use a Redis Hash to store presence: "presence" -> { userId: count }
  const PRESENCE_KEY = 'presence';

  io.use(async (socket, next) => {
    try {
      const cookies = socket.handshake.headers.cookie;
      if (!cookies) return next(new Error('Authentication error: No cookies'));

      const parsedCookies = cookie.parse(cookies);
      const token = parsedCookies.token;
      if (!token) return next(new Error('Authentication error: No token'));

      const decoded = verifyToken(token);
      
      (socket as any).user = decoded;
      
      next();
    } catch (err) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', async (socket) => {
    const user = (socket as any).user;
    
    try {
      const count = await pubClient.hincrby(PRESENCE_KEY, user.userId, 1);
      
      if (count === 1) {
        // First connection across the entire cluster
        io.emit('user.status', { userId: user.userId, status: 'online', username: user.username });
      }
    } catch (err) {
      console.error('Redis presence error (connect):', err);
    }

    console.log(`User connected: ${user.username} (${socket.id})`);

    // Handle typing indicator
    socket.on('user.typing', (data: { channel: string; isTyping: boolean }) => {
      socket.to(data.channel).emit('user.typing', {
        userId: user.userId,
        username: user.username,
        isTyping: data.isTyping
      });
    });

    socket.on('channel.join', (channelName: string) => {
      socket.join(channelName);
      console.log(`User ${user.username} joined channel: ${channelName}`);
    });

    socket.on('message.send', async (data) => {
      console.log('Message received:', data);
      
      try {
        if (!data?.text || typeof data.text !== 'string') return;
        if (!data?.channel || typeof data.channel !== 'string') return;

        const channelResult = await pool.query('SELECT id FROM channels WHERE name = $1', [data.channel]);
        const channelId = channelResult.rows[0]?.id;

        if (!channelId) return;

        const result = await pool.query(
          `INSERT INTO messages (channel_id, user_id, content, client_message_id) 
           VALUES ($1, $2, $3, $4) 
           ON CONFLICT (client_message_id) DO NOTHING 
           RETURNING *`,
          [channelId, user.userId, data.text, data.client_message_id]
        );

        if (result.rows.length === 0) {
          console.log(`Duplicate message detected for client_message_id: ${data.client_message_id}`);
          return;
        }

        const savedMessage = result.rows[0];

        io.to(data.channel).emit('message.new', {
          id: savedMessage.id,
          text: savedMessage.content,
          sender: user.username,
          client_message_id: savedMessage.client_message_id,
          createdAt: savedMessage.created_at
        });
      } catch (err) {
        console.error('Error saving message:', err);
      }
    });

    socket.on('disconnect', async () => {
      try {
        const count = await pubClient.hincrby(PRESENCE_KEY, user.userId, -1);
        if (count <= 0) {
          await pubClient.hdel(PRESENCE_KEY, user.userId);
          io.emit('user.status', { userId: user.userId, status: 'offline' });
        }
      } catch (err) {
        console.error('Redis presence error (disconnect):', err);
      }
      console.log(`User disconnected: ${user.username} (${socket.id})`);
    });
  });

  return io;
};
