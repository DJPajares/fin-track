import axios from 'axios';
import type { AuthUser } from '@shared/types/Auth';
import { STORAGE_KEYS } from '@web/constants/storageKeys';

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

export type UpdateProfilePayload = {
  name?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
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
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, data.data.token);
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
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, data.data.token);
    return data.data;
  }

  throw new Error('Signup failed');
};

/**
 * Logout user
 */
export const logout = async (): Promise<void> => {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

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
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
};

/**
 * Get current user
 */
export const getCurrentUser = async (): Promise<AuthUser> => {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

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
  return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!getStoredToken();
};

export const updateUserSettings = async (settings: UserSettings) => {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  const { data } = await axios.put(`${BASE_URL}/auth/me/settings`, settings, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data?.data?.user;
};

export const updateProfile = async (payload: UpdateProfilePayload) => {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  if (!token) {
    throw new Error('No token found');
  }

  const { data } = await axios.put(`${BASE_URL}/auth/me/profile`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return data?.data?.user;
};

export const deleteAccount = async (payload: { currentPassword: string }) => {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  if (!token) {
    throw new Error('No token found');
  }

  const { data } = await axios.delete(`${BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
    data: payload,
  });

  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);

  return data;
};
