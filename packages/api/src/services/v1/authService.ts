import { UserModel } from '../../models/v1/userModel';
import {
  hashPassword,
  comparePassword,
  generateToken,
  validateEmail,
  validatePassword,
} from '../../utilities/authUtils';
import {
  RegisterRequest,
  LoginRequest,
  AuthResponse,
} from '../../types/authTypes';

export const registerUser = async (
  userData: RegisterRequest,
): Promise<AuthResponse> => {
  try {
    const { email, password, firstName, lastName } = userData;

    // Validate input
    if (!validateEmail(email)) {
      return {
        success: false,
        message: 'Invalid email format',
      };
    }

    if (!validatePassword(password)) {
      return {
        success: false,
        message:
          'Password must be at least 8 characters with uppercase, lowercase, and number',
      };
    }

    if (!firstName.trim() || !lastName.trim()) {
      return {
        success: false,
        message: 'First name and last name are required',
      };
    }

    // Check if user already exists
    const existingUser = await UserModel.findOne({
      email: email.toLowerCase(),
    });
    if (existingUser) {
      return {
        success: false,
        message: 'User with this email already exists',
      };
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = new UserModel({
      email: email.toLowerCase(),
      password: hashedPassword,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id.toString(), user.email);

    return {
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  } catch (error) {
    console.error('Registration error:', error);
    return {
      success: false,
      message: 'Registration failed',
    };
  }
};

export const loginUser = async (
  credentials: LoginRequest,
): Promise<AuthResponse> => {
  try {
    const { email, password } = credentials;

    // Validate input
    if (!email || !password) {
      return {
        success: false,
        message: 'Email and password are required',
      };
    }

    // Find user
    const user = await UserModel.findOne({ email: email.toLowerCase() });
    if (!user) {
      return {
        success: false,
        message: 'Invalid credentials',
      };
    }

    // Check if user is active
    if (!user.isActive) {
      return {
        success: false,
        message: 'Account is deactivated',
      };
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      return {
        success: false,
        message: 'Invalid credentials',
      };
    }

    // Update last login
    user.lastLoginAt = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id.toString(), user.email);

    return {
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      message: 'Login failed',
    };
  }
};

export const getUserProfile = async (userId: string) => {
  try {
    const user = await UserModel.findById(userId).select('-password');
    if (!user) {
      return null;
    }

    return {
      id: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isActive: user.isActive,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  } catch (error) {
    console.error('Get user profile error:', error);
    return null;
  }
};
