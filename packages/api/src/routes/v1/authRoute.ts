import express from 'express';
import { signup, login, me, logout } from '../../controllers/v1/authController';
import { authenticateToken } from '../../middleware/authMiddleware';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', authenticateToken as any, me as any);

export default router;
