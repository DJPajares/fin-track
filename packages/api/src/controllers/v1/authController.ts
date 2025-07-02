import { NextFunction, Request, Response } from 'express';
import { AuthService, SocialUserData } from '../../services/v1/authService';

const socialLogin = async (req: Request, res: Response, next: NextFunction) => {
  /**
   * Handle social login - find or create user
   */

  try {
    const { email, name, image, provider, providerId }: SocialUserData =
      req.body;

    // Validate required fields
    if (!email || !name || !provider || !providerId) {
      res.status(400).json({
        success: false,
        message: 'Missing required fields: email, name, provider, providerId',
      });
      return;
    }

    // Validate provider
    if (!['github', 'google'].includes(provider)) {
      res.status(400).json({
        success: false,
        message: 'Invalid provider. Must be either "github" or "google"',
      });
      return;
    }

    const userData: SocialUserData = {
      email,
      name,
      image,
      provider,
      providerId,
    };

    const result = await AuthService.findOrCreateUser(userData);

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: result.user._id,
          email: result.user.email,
          name: result.user.name,
          image: result.user.image,
          provider: result.user.provider,
        },
        token: result.token,
      },
      message: 'Authentication successful',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Verify JWT token and return user data
 */
const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'No token provided',
      });
      return;
    }

    const decoded = AuthService.verifyToken(token);
    const user = await AuthService.getUserById(decoded.userId);

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          image: user.image,
          provider: user.provider,
        },
      },
      message: 'Token verified successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user profile
 */
const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'No token provided',
      });
      return;
    }

    const decoded = AuthService.verifyToken(token);
    const user = await AuthService.getUserById(decoded.userId);

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          image: user.image,
          provider: user.provider,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
      message: 'Profile retrieved successfully',
    });
  } catch (error) {
    next(error);
  }
};

export { socialLogin, verifyToken, getProfile };
