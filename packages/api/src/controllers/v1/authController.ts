import { Request, Response } from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
} from '../../services/v1/authService';
import {
  RegisterRequest,
  LoginRequest,
  AuthenticatedRequest,
} from '../../types/authTypes';

export const register = async (req: Request, res: Response) => {
  try {
    const userData: RegisterRequest = req.body;
    const result = await registerUser(userData);

    if (result.success) {
      return res.status(201).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    console.error('Register controller error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const credentials: LoginRequest = req.body;
    const result = await loginUser(credentials);

    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(401).json(result);
    }
  } catch (error) {
    console.error('Login controller error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const getProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    const profile = await getUserProfile(req.user.id);
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully',
      user: profile,
    });
  } catch (error) {
    console.error('Get profile controller error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
