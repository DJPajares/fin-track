import jwt from 'jsonwebtoken';
import { UserModel, UserProps } from '../../models/v1/userModel';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
// const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export interface SocialUserData {
  email: string;
  name: string;
  image?: string;
  provider: 'github' | 'google';
  providerId: string;
}

export interface AuthResponse {
  user: UserProps;
  token: string;
}

export const AuthService = {
  /**
   * Find or create user from social login data
   */
  async findOrCreateUser(userData: SocialUserData): Promise<AuthResponse> {
    try {
      // First, try to find user by provider and providerId
      let user = await UserModel.findOne({
        provider: userData.provider,
        providerId: userData.providerId,
      });

      if (!user) {
        // If not found by provider, try to find by email
        user = await UserModel.findOne({ email: userData.email });

        if (user) {
          // User exists with different provider, update the provider info
          user.provider = userData.provider;
          user.providerId = userData.providerId;
          user.name = userData.name;
          if (userData.image) {
            user.image = userData.image;
          }
          await user.save();
        } else {
          // Create new user
          user = new UserModel(userData);
          await user.save();
        }
      } else {
        // User found, update profile data if needed
        const needsUpdate =
          user.name !== userData.name || user.image !== userData.image;

        if (needsUpdate) {
          user.name = userData.name;
          if (userData.image) {
            user.image = userData.image;
          }
          await user.save();
        }
      }

      // Generate JWT token
      const token = AuthService.generateToken(user);

      return { user, token };
    } catch (error) {
      throw new Error(
        `Authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  },

  /**
   * Generate JWT token for user
   */
  generateToken(user: UserProps): string {
    const payload = {
      userId: user._id.toString(),
      email: user.email,
      provider: user.provider,
    };

    return jwt.sign(payload, JWT_SECRET);
  },

  /**
   * Verify JWT token and return user data
   */
  verifyToken(token: string) {
    try {
      return jwt.verify(token, JWT_SECRET) as {
        userId: string;
        email: string;
        provider: string;
      };
    } catch {
      throw new Error('Invalid token');
    }
  },

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<UserProps | null> {
    return await UserModel.findById(userId);
  },

  /**
   * Get user by email
   */
  async getUserByEmail(email: string): Promise<UserProps | null> {
    return await UserModel.findOne({ email: email.toLowerCase() });
  },
};
