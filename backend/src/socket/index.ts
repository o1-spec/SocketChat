import { Server } from 'socket.io';
import http from 'http';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import pool from '../config/db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

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

      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string; username: string };
      
      // Attach user info to socket
      (socket as any).user = {
        id: decoded.userId,
        email: decoded.email,
        username: decoded.username
      };
      
      next();
    } catch (err) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const user = (socket as any).user;
    console.log(`User connected: ${user.username} (${socket.id})`);

    // Handle joining a channel (room)
    socket.on('join_channel', (channelName: string) => {
      socket.join(channelName);
      console.log(`User ${user.username} joined channel: ${channelName}`);
    });

    socket.on('message', async (data) => {
      console.log('Message received:', data);
      
      try {
        // 1. Get channel ID
        const channelResult = await pool.query('SELECT id FROM channels WHERE name = $1', [data.channel || 'general']);
        const channelId = channelResult.rows[0]?.id;

        if (!channelId) return;

        // 2. Persist to database
        const result = await pool.query(
          'INSERT INTO messages (channel_id, user_id, content) VALUES ($1, $2, $3) RETURNING *',
          [channelId, user.id, data.text]
        );

        const savedMessage = result.rows[0];

        // 3. Broadcast to the room
        io.to(data.channel || 'general').emit('message', {
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
