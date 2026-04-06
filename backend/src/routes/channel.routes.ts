import express from 'express';
import pool from '../config/db';
import { authMiddleware } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/:channelName/messages', authMiddleware, async (req, res) => {
  const { channelName } = req.params;
  
  try {
    const channelResult = await pool.query('SELECT id FROM channels WHERE name = $1', [channelName]);
    const channelId = channelResult.rows[0]?.id;

    if (!channelId) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    const messagesResult = await pool.query(`
      SELECT m.id, m.content as text, u.username as sender, m.created_at as "createdAt" 
      FROM messages m
      JOIN users u ON m.user_id = u.id
      WHERE m.channel_id = $1
      ORDER BY m.created_at ASC
      LIMIT 100
    `, [channelId]);

    res.json(messagesResult.rows);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ message: 'Error fetching message history' });
  }
});

export default router;
