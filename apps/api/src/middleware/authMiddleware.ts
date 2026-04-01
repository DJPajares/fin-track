import { NextFunction, Response } from 'express';

import { languages } from '../../../../packages/shared/constants/languages';
import { AuthResponse } from '../../../../packages/shared/types/Auth';
import type { LocaleProps } from '../../../../packages/shared/types/Locale';
import { getUserById, verifyToken } from '../services/v1/authService';
import { RequestWithUser } from '../types/userTypes';

const isLocale = (value: string | null | undefined): value is LocaleProps => {
  return (
    typeof value === 'string' &&
    languages.some((language) => language.value === value)
  );
};

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

    const settings = dbUser.settings
      ? {
          language: isLocale(dbUser.settings.language)
            ? dbUser.settings.language
            : null,
          currency: dbUser.settings.currency ?? null,
          darkMode: dbUser.settings.darkMode ?? null,
        }
      : undefined;

    const authUser: AuthResponse = {
      id: dbUser.id,
      email: dbUser.email ?? null,
      name: dbUser.name ?? null,
      image: dbUser.image ?? null,
      settings,
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
