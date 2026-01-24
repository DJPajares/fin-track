import { Response, NextFunction } from 'express';
import { verifyToken, getUserById } from '../services/v1/authService';
import { RequestWithUser } from '../types/userTypes';
import { AuthResponse } from '../../../../shared/types/Auth';

/**
 * Middleware to authenticate requests using JWT token
 */
export const authenticateToken = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    const token =
      authHeader && authHeader.startsWith('Bearer ')
        ? authHeader.substring(7)
        : null;

    if (!token) {
      const error = new Error('Authentication token required') as Error & {
        statusCode?: number;
      };
      error.statusCode = 401;
      throw error;
    }

    // Verify token
    const decoded = verifyToken(token);

    // Get user details
    const dbUser = await getUserById(decoded.id);

    if (!dbUser) {
      const error = new Error('User not found') as Error & {
        statusCode?: number;
      };
      error.statusCode = 401;
      throw error;
    }

    const authUser: AuthResponse = {
      id: dbUser.id,
      email: dbUser.email ?? null,
      name: dbUser.name ?? null,
      image: dbUser.image ?? null,
      // convert null settings to undefined and omit extra fields
      settings: dbUser.settings ?? undefined,
    };

    // Attach user to request
    req.user = authUser;

    next();
  } catch (error) {
    if (error instanceof Error) {
      const jwtError = error as Error & { name?: string };
      if (jwtError.name === 'JsonWebTokenError') {
        (error as Error & { statusCode?: number }).message = 'Invalid token';
        (error as Error & { statusCode?: number }).statusCode = 401;
      } else if (jwtError.name === 'TokenExpiredError') {
        (error as Error & { statusCode?: number }).message = 'Token expired';
        (error as Error & { statusCode?: number }).statusCode = 401;
      }
    }
    next(error);
  }
};
