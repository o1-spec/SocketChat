import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validate } from 'class-validator';
import { RegisterDto, LoginDto } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const registerUser = async (req: Request, res: Response) => {
  try {
    const dto = new RegisterDto();
    Object.assign(dto, req.body);
    
    const errors = await validate(dto);
    if (errors.length > 0) {
      return res.status(400).json({ errors: errors.map(e => Object.values(e.constraints || {})).flat() });
    }

    // In a real app, you would check if user exists in DB here
    // For now, we simulate user creation
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    
    // Simulate DB user object
    const user = {
      id: Math.random().toString(36).substring(7),
      username: dto.username,
      email: dto.email,
    };

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });

    res.status(201).json({
      message: 'User registered successfully',
      user: { id: user.id, username: user.username, email: user.email },
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const dto = new LoginDto();
    Object.assign(dto, req.body);
    
    const errors = await validate(dto);
    if (errors.length > 0) {
      return res.status(400).json({ errors: errors.map(e => Object.values(e.constraints || {})).flat() });
    }

    // Simulate finding user 
    // In real app: const user = await db.users.findUnique({ where: { email: dto.email } });
    const mockUser = {
      id: '12345',
      username: 'johndoe',
      email: dto.email,
      password: await bcrypt.hash('password123', 10) // Mocked for comparison
    };

    const isValid = await bcrypt.compare(dto.password, mockUser.password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: mockUser.id }, JWT_SECRET, { expiresIn: '24h' });

    res.json({
      message: 'Login successful',
      user: { id: mockUser.id, username: mockUser.username, email: mockUser.email },
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
