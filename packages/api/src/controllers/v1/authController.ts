import { Request, Response, NextFunction } from 'express';
import {
  signup as signupService,
  login as loginService,
  getUserById,
  updateSettings as updateSettingsService,
  updateProfile as updateProfileService,
  deleteAccount as deleteAccountService,
} from '../../services/v1/authService';
import type { RequestWithUser } from '../../types/userTypes';
import type {
  AuthSignupRequest,
  AuthLoginRequest,
  AuthSettingsRequest,
} from '../../../../../shared/types/Auth';

/**
 * Signup controller
 */
const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const credentials: AuthSignupRequest = req.body;

    // Validate required fields
    if (!credentials.email || !credentials.password) {
      const error = new Error('Email and password are required') as Error & {
        statusCode?: number;
      };
      error.statusCode = 400;
      throw error;
    }

    const data = await signupService(credentials);

    res.status(201).json(data);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === 'Email already registered'
    ) {
      (error as Error & { statusCode?: number }).statusCode = 400;
    }
    next(error);
  }
};

/**
 * Login controller
 */
const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const credentials: AuthLoginRequest = req.body;

    // Validate required fields
    if (!credentials.email || !credentials.password) {
      const error = new Error('Email and password are required') as Error & {
        statusCode?: number;
      };
      error.statusCode = 400;
      throw error;
    }

    const data = await loginService(credentials);

    res.status(200).json(data);
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message === 'Email not registered' ||
        error.message === 'Incorrect password')
    ) {
      (error as Error & { statusCode?: number }).statusCode = 401;
    }
    next(error);
  }
};

/**
 * Get current user (me endpoint)
 */
const me = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;
    const data = await getUserById(userId);

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

/**
 * Logout controller (client-side only, just returns success)
 */
const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = {
      message: 'Logged out successfully',
    };

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const updateSettings = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user.id;

    const { language, currency, darkMode } = req.body as AuthSettingsRequest;

    const data = await updateSettingsService({
      userId,
      language,
      currency,
      darkMode,
    });

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user.id;
    const { name, email, currentPassword, newPassword } = req.body as {
      name?: string;
      email?: string;
      currentPassword?: string;
      newPassword?: string;
    };

    const data = await updateProfileService({
      userId,
      name,
      email,
      currentPassword,
      newPassword,
    });

    res.status(200).json(data);
  } catch (error) {
    if (error instanceof Error) {
      const messagesToStatus: Record<string, number> = {
        'Email already registered': 400,
        'Current password is required': 400,
        'Current password is required to change password': 400,
        'Password must be at least 8 characters': 400,
        'Incorrect password': 401,
        'User not found': 404,
      };

      const statusCode = messagesToStatus[error.message];
      if (statusCode) {
        (error as Error & { statusCode?: number }).statusCode = statusCode;
      }
    }

    next(error);
  }
};

const deleteAccount = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user.id;
    const { currentPassword } = req.body as { currentPassword?: string };

    await deleteAccountService({ userId, currentPassword });

    const data = { deleted: true };

    res.status(200).json(data);
  } catch (error) {
    if (error instanceof Error) {
      const messagesToStatus: Record<string, number> = {
        'Current password is required': 400,
        'Incorrect password': 401,
        'User not found': 404,
      };

      const statusCode = messagesToStatus[error.message];
      if (statusCode) {
        (error as Error & { statusCode?: number }).statusCode = statusCode;
      }
    }

    next(error);
  }
};

export {
  signup,
  login,
  me,
  logout,
  updateSettings,
  updateProfile,
  deleteAccount,
};
