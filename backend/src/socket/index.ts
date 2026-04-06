import { Server } from 'socket.io';
import http from 'http';
import cookie from 'cookie';
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

  io.on('connection', (socket) => {
    const user = (socket as any).user;
    console.log(`User connected: ${user.username} (${socket.id})`);

    socket.on('channel.join', (channelName: string) => {
      socket.join(channelName);
      console.log(`User ${user.username} joined channel: ${channelName}`);
    });

    socket.on('message.send', async (data) => {
      console.log('Message received:', data);
      
      try {
        // Validation
        if (!data?.text || typeof data.text !== 'string') return;
        if (!data?.channel || typeof data.channel !== 'string') return;

        const channelResult = await pool.query('SELECT id FROM channels WHERE name = $1', [data.channel]);
        const channelId = channelResult.rows[0]?.id;

        if (!channelId) return;

        const result = await pool.query(
          'INSERT INTO messages (channel_id, user_id, content) VALUES ($1, $2, $3) RETURNING *',
          [channelId, user.userId, data.text]
        );

        const savedMessage = result.rows[0];

        io.to(data.channel).emit('message.new', {
          id: savedMessage.id,
          text: savedMessage.content,
          sender: user.username,
          createdAt: savedMessage.created_at
        });
      } catch (err) {
        console.error('Error saving message:', err);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  return io;
};
