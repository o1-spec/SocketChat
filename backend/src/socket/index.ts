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

  // Simple in-memory presence tracking (for single-server MVP)
  // Maps userId -> Set of active socket IDs
  const onlineUsers = new Map<string, Set<string>>();

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
    
    // Add to presence map
    if (!onlineUsers.has(user.userId)) {
      onlineUsers.set(user.userId, new Set());
      // First connection for this user - broadcast "user.online"
      io.emit('user.status', { userId: user.userId, status: 'online', username: user.username });
    }
    onlineUsers.get(user.userId)?.add(socket.id);

    console.log(`User connected: ${user.username} (${socket.id}). Online users: ${onlineUsers.size}`);

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

        // Persist to database with idempotency check using client_message_id
        const result = await pool.query(
          `INSERT INTO messages (channel_id, user_id, content, client_message_id) 
           VALUES ($1, $2, $3, $4) 
           ON CONFLICT (client_message_id) DO NOTHING 
           RETURNING *`,
          [channelId, user.userId, data.text, data.client_message_id]
        );

        // If result.rows is empty, it means the message was a duplicate
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

    socket.on('disconnect', () => {
      const userSockets = onlineUsers.get(user.userId);
      if (userSockets) {
        userSockets.delete(socket.id);
        if (userSockets.size === 0) {
          onlineUsers.delete(user.userId);
          // Last connection closed - broadcast "user.offline"
          io.emit('user.status', { userId: user.userId, status: 'offline' });
        }
      }
      console.log(`User disconnected: ${user.username} (${socket.id}). Online users: ${onlineUsers.size}`);
    });
  });

  return io;
};
