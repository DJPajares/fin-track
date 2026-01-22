import axios from 'axios';
import type { AuthUser } from '@shared/types/Auth';

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001/api/v1';

export type LoginCredentials = {
  email: string;
  password: string;
};

export type SignupCredentials = {
  email: string;
  password: string;
  name?: string;
};

export type AuthResponse = {
  user: AuthUser;
  token: string;
};

export type UserSettings = {
  language?: string;
  currency?: string;
  darkMode?: boolean;
};

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

export const updateUserSettings = async (settings: UserSettings) => {
  const token = localStorage.getItem('auth_token');
  const { data } = await axios.put(`${BASE_URL}/auth/me/settings`, settings, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data?.data?.user;
};
