import express from 'express';
import Redis from 'ioredis';
import { authMiddleware } from '../middleware/auth.middleware';

const router = express.Router();
const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPort = parseInt(process.env.REDIS_PORT || '6379');
const pubClient = new Redis({ host: redisHost, port: redisPort });
const PRESENCE_KEY = 'presence';

router.get('/online', authMiddleware, async (req, res) => {
  try {
    const presenceHash = await pubClient.hgetall(PRESENCE_KEY);
    const onlineUserIds = Object.keys(presenceHash).filter(userId => parseInt(presenceHash[userId]) > 0);
    
    // Fetch usernames from individual user hashes
    const users = await Promise.all(onlineUserIds.map(async (userId) => {
      const username = await pubClient.hget(`user:${userId}`, 'username');
      return { userId, username: username || `User ${userId.slice(0, 4)}` };
    }));
    
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch presence' });
  }
});

export default router;
