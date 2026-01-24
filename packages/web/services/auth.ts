import axios from 'axios';
import { STORAGE_KEYS } from '@web/constants/storageKeys';
import type {
  AuthResponse,
  AuthResponseToken,
  AuthSignupRequest,
  AuthLoginRequest,
  AuthUpdateRequest,
  AuthSettingsRequest,
} from '@shared/types/Auth';

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001/api/v1';

/**
 * Login with email and password
 */
export const login = async (
  credentials: AuthLoginRequest,
): Promise<AuthResponseToken> => {
  const { status, data } = await axios.post(
    `${BASE_URL}/auth/login`,
    credentials,
  );

  if (status === 200 && data) {
    // Store token in localStorage
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, data.token);
    return data;
  }

  throw new Error('Login failed');
};

/**
 * Signup with email and password
 */
export const signup = async (
  credentials: AuthSignupRequest,
): Promise<AuthResponseToken> => {
  const { status, data } = await axios.post(
    `${BASE_URL}/auth/signup`,
    credentials,
  );

  if (status === 200 && data) {
    // Store token in localStorage
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, data.token);
    return data;
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
export const getCurrentUser = async (): Promise<AuthResponse> => {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

  if (!token) {
    throw new Error('No token found');
  }

  const { status, data } = await axios.get(`${BASE_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (status === 200 && data) {
    return data;
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

export const updateUserSettings = async (settings: AuthSettingsRequest) => {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  const { data } = await axios.put(`${BASE_URL}/auth/me/settings`, settings, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data?.data?.user;
};

export const updateProfile = async (payload: AuthUpdateRequest) => {
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
