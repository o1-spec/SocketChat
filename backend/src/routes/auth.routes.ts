import { Router } from 'express';
import { registerUser, loginUser, logoutUser, getMe } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', (req, res, next) => {
  registerUser(req, res).catch(next);
});

router.post('/login', (req, res, next) => {
  loginUser(req, res).catch(next);
});

router.post('/logout', logoutUser);

router.get('/me', authMiddleware, (req, res, next) => {
  getMe(req, res).catch(next);
});

export default router;
