import express from 'express';
import {
  signup,
  login,
  me,
  logout,
  updateSettings,
  updateProfile,
  deleteAccount,
} from '../../controllers/v1/authController';
import { authenticateToken } from '../../middleware/authMiddleware';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', authenticateToken as any, me as any);
router.put('/me/settings', authenticateToken as any, updateSettings as any);
router.put('/me/profile', authenticateToken as any, updateProfile as any);
router.delete('/me', authenticateToken as any, deleteAccount as any);

export default router;
