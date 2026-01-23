import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { UserModel, type UserProps } from '../../models/v1/userModel';
import {
  AuthResponse,
  LoginCredentials,
  SignupCredentials,
} from '../../types/userTypes';

dotenv.config();

const JWT_SECRET: jwt.Secret = process.env.JWT_SECRET ?? '';
const JWT_EXPIRES_IN: jwt.SignOptions['expiresIn'] =
  (process.env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn']) || '7d';

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

/**
 * Generate JWT token for user
 */
const generateToken = (userId: string): string => {
  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

/**
 * Verify JWT token
 */
const verifyToken = (token: string): { id: string } => {
  return jwt.verify(token, JWT_SECRET) as { id: string };
};

/**
 * Register a new user
 */
const signup = async (
  credentials: SignupCredentials,
): Promise<AuthResponse> => {
  const { email, password, name } = credentials;

  // Validate email format
  if (!email || !email.includes('@')) {
    throw new Error('Valid email is required');
  }

  // Validate password length
  if (!password || password.length < 8) {
    throw new Error('Password must be at least 8 characters');
  }

  // Check if user already exists
  const existingUser = await UserModel.findOne({
    email: email.toLowerCase(),
  });
  if (existingUser) {
    throw new Error('Email already registered');
  }

  try {
    // Create new user - MongoDB will auto-generate _id
    const user = await UserModel.create({
      email: email.toLowerCase(),
      password,
      name: name || '',
    });

    // Generate token using MongoDB's _id
    const token = generateToken(user._id.toString());

    return {
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        image: user.image,
      },
      token,
    };
  } catch (error: unknown) {
    console.log('Error in signup controller:', error);
    if (error instanceof Error) {
      // Handle MongoDB duplicate key errors
      if (
        error.message.includes('E11000') ||
        error.message.includes('duplicate')
      ) {
        throw new Error('Email already registered');
      }
    }
    throw error;
  }
};

/**
 * Login user
 */
const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const { email, password } = credentials;

  // Find user and include password field
  const user = (await UserModel.findOne({
    email: email.toLowerCase(),
  }).select('+password')) as unknown as {
    id: string;
    email: string;
    name?: string;
    image?: string;
    settings?: Record<string, unknown>;
    comparePassword: (password: string) => Promise<boolean>;
  };

  if (!user) {
    throw new Error('Email not registered');
  }

  // Verify password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new Error('Incorrect password');
  }

  // Update last login time
  await UserModel.updateOne({ _id: user.id }, { lastLoginAt: new Date() });

  // Generate token
  const token = generateToken(user.id);

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.image,
      settings: user.settings,
    },
    token,
  };
};

/**
 * Get user by ID
 */
const getUserById = async (userId: string) => {
  const user = await UserModel.findById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  return {
    id: user._id.toString(),
    email: user.email,
    name: user.name,
    image: user.image,
    settings: user.settings,
  };
};

const updateProfile = async ({
  userId,
  name,
  email,
  currentPassword,
  newPassword,
}: {
  userId: string;
  name?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}) => {
  const user = (await UserModel.findById(userId)
    .select('+password')
    .exec()) as UserProps | null;

  if (!user) {
    throw new Error('User not found');
  }

  if (email && email.toLowerCase() !== user.email) {
    const emailInUse = await UserModel.findOne({
      email: email.toLowerCase(),
      _id: { $ne: userId },
    });

    if (emailInUse) {
      const error = new Error('Email already registered') as Error & {
        statusCode?: number;
      };
      error.statusCode = 400;
      throw error;
    }

    user.email = email.toLowerCase();
  }

  if (name !== undefined) {
    user.name = name;
  }

  if (newPassword) {
    if (!currentPassword) {
      const error = new Error(
        'Current password is required to change password',
      ) as Error & { statusCode?: number };
      error.statusCode = 400;
      throw error;
    }

    const isCurrentValid = await user.comparePassword(currentPassword);

    if (!isCurrentValid) {
      const error = new Error('Incorrect password') as Error & {
        statusCode?: number;
      };
      error.statusCode = 401;
      throw error;
    }

    if (newPassword.length < 8) {
      const error = new Error(
        'Password must be at least 8 characters',
      ) as Error & { statusCode?: number };
      error.statusCode = 400;
      throw error;
    }

    user.password = newPassword;
  }

  await user.save();

  return {
    id: user._id.toString(),
    email: user.email,
    name: user.name,
    image: user.image,
    settings: user.settings,
  };
};

const deleteAccount = async ({
  userId,
  currentPassword,
}: {
  userId: string;
  currentPassword?: string;
}) => {
  const user = (await UserModel.findById(userId)
    .select('+password')
    .exec()) as UserProps | null;

  if (!user) {
    throw new Error('User not found');
  }

  if (!currentPassword) {
    const error = new Error('Current password is required') as Error & {
      statusCode?: number;
    };
    error.statusCode = 400;
    throw error;
  }

  const isCurrentValid = await user.comparePassword(currentPassword);

  if (!isCurrentValid) {
    const error = new Error('Incorrect password') as Error & {
      statusCode?: number;
    };
    error.statusCode = 401;
    throw error;
  }

  await user.deleteOne();

  return { id: userId };
};

const updateSettings = async ({
  userId,
  language,
  currency,
  darkMode,
}: {
  userId: string;
  language?: string;
  currency?: string;
  darkMode?: boolean;
}) => {
  const user = await UserModel.findByIdAndUpdate(
    userId,
    {
      $set: {
        'settings.language': language,
        'settings.currency': currency,
        'settings.darkMode': darkMode,
      },
    },
    { new: true },
  );

  if (!user) {
    throw new Error('User not found');
  }

  return {
    id: user?._id.toString(),
    email: user?.email,
    name: user?.name,
    image: user?.image,
    settings: user?.settings,
  };
};

export {
  signup,
  login,
  generateToken,
  verifyToken,
  getUserById,
  updateSettings,
  updateProfile,
  deleteAccount,
};
