import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utilities/authUtils';
import { UserModel } from '../models/v1/userModel';
import { AuthenticatedRequest } from '../types/authTypes';

// Extend Express Request type for headers
interface AuthRequest extends Request {
  headers: {
    authorization?: string;
    [key: string]: any;
  };
}

export const authenticateToken = async (
  req: AuthenticatedRequest & AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required',
      });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired token',
      });
    }

    // Verify user still exists and is active
    const user = await UserModel.findById(decoded.userId).select('-password');
    if (!user || !user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'User not found or inactive',
      });
    }

    // Attach user to request
    req.user = {
      id: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    next();
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: 'Authentication error',
    });
  }
};

export const optionalAuth = async (
  req: AuthenticatedRequest & AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = verifyToken(token);
      if (decoded) {
        const user = await UserModel.findById(decoded.userId).select(
          '-password',
        );
        if (user && user.isActive) {
          req.user = {
            id: user._id.toString(),
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
          };
        }
      }
    }

    next();
  } catch (error) {
    console.error(error);
    // Continue without authentication
    next();
  }
};
