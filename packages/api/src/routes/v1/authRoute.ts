import express from 'express';
import {
  socialLogin,
  verifyToken,
  getProfile,
} from '../../controllers/v1/authController';

const router = express.Router();

// Social login - find or create user
router.post('/social-login', socialLogin);

// Verify JWT token
router.post('/verify-token', verifyToken);

// Get user profile
router.get('/profile', getProfile);

export default router;
