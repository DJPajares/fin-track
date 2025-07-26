import express from 'express';
import {
  register,
  login,
  getProfile,
} from '../../controllers/v1/authController';
import { authenticateToken } from '../../middleware/authMiddleware';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/profile', authenticateToken, getProfile);

export default router;
