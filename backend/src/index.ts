import express, { Request, Response } from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { setupSocket } from './socket';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
setupSocket(server);

app.use(cors());
app.use(express.json());

// Main Routes (to be expanded)
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
