import axios from 'axios';

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001/api/v1';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
  name?: string;
}

export interface AuthUser {
  id: string;
  email?: string | null;
  name?: string | null;
  image?: string | null;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}

/**
 * Login with email and password
 */
export const login = async (
  credentials: LoginCredentials,
): Promise<AuthResponse> => {
  const { data } = await axios.post(`${BASE_URL}/auth/login`, credentials);

  if (data.success && data.data) {
    // Store token in localStorage
    localStorage.setItem('auth_token', data.data.token);
    return data.data;
  }

  throw new Error('Login failed');
};

/**
 * Signup with email and password
 */
export const signup = async (
  credentials: SignupCredentials,
): Promise<AuthResponse> => {
  const { data } = await axios.post(`${BASE_URL}/auth/signup`, credentials);

  if (data.success && data.data) {
    // Store token in localStorage
    localStorage.setItem('auth_token', data.data.token);
    return data.data;
  }

  throw new Error('Signup failed');
};

/**
 * Logout user
 */
export const logout = async (): Promise<void> => {
  const token = localStorage.getItem('auth_token');

  if (token) {
    try {
      await axios.post(
        `${BASE_URL}/auth/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    } catch (error) {
      console.error('Logout API call failed:', error);
    }
  }

  // Clear token from localStorage
  localStorage.removeItem('auth_token');
};

/**
 * Get current user
 */
export const getCurrentUser = async (): Promise<AuthUser> => {
  const token = localStorage.getItem('auth_token');

  if (!token) {
    throw new Error('No token found');
  }

  const { data } = await axios.get(`${BASE_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (data.success && data.data) {
    return data.data;
  }

  throw new Error('Failed to get current user');
};

/**
 * Get stored token
 */
export const getStoredToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!getStoredToken();
};
