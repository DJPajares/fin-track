import type {
  AuthLoginRequest,
  AuthResponse,
  AuthSettingsRequest,
  AuthSignupRequest,
  AuthTokenResponse,
  AuthUpdateRequest,
} from '@shared/types/Auth';
import { STORAGE_KEYS } from '@web/constants/storageKeys';

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001/api/v1';

type UpdateUserSettingsResponse = {
  data?: {
    user?: AuthResponse;
  };
};

const toAuthUrl = (path: string): string => {
  const normalizedBase = BASE_URL.replace(/\/$/, '');
  const normalizedPath = path.replace(/^\//, '');
  return `${normalizedBase}/${normalizedPath}`;
};

const parseJsonResponse = async <T>(response: Response): Promise<T | null> => {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
};

const readErrorMessage = (payload: unknown): string | undefined => {
  if (!payload || typeof payload !== 'object') {
    return undefined;
  }

  const payloadRecord = payload as Record<string, unknown>;
  const nestedError = payloadRecord.error;

  if (nestedError && typeof nestedError === 'object') {
    const nestedErrorRecord = nestedError as Record<string, unknown>;
    if (typeof nestedErrorRecord.message === 'string') {
      return nestedErrorRecord.message;
    }
  }

  if (typeof payloadRecord.message === 'string') {
    return payloadRecord.message;
  }

  return undefined;
};

const authRequest = async <T>(
  path: string,
  init: RequestInit = {},
): Promise<{ status: number; data: T | null }> => {
  const headers = new Headers(init.headers);

  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(toAuthUrl(path), {
    ...init,
    headers,
  });

  const data = await parseJsonResponse<T>(response);

  if (!response.ok) {
    const message =
      readErrorMessage(data) ||
      response.statusText ||
      `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return { status: response.status, data };
};

/**
 * Login with email and password
 */
export const login = async (
  credentials: AuthLoginRequest,
): Promise<AuthTokenResponse> => {
  const { status, data } = await authRequest<AuthTokenResponse>('auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });

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
): Promise<AuthTokenResponse> => {
  const { status, data } = await authRequest<AuthTokenResponse>('auth/signup', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });

  if (status === 201 && data) {
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
      await authRequest<null>('auth/logout', {
        method: 'POST',
        body: JSON.stringify({}),
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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

  const { status, data } = await authRequest<AuthResponse>('auth/me', {
    method: 'GET',
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
  const { data } = await authRequest<UpdateUserSettingsResponse>(
    'auth/me/settings',
    {
      method: 'PUT',
      body: JSON.stringify(settings),
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  if (!data) {
    return undefined;
  }

  return data.data?.user;
};

export const updateProfile = async (payload: AuthUpdateRequest) => {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  if (!token) {
    throw new Error('No token found');
  }

  const { data } = await authRequest<AuthResponse>('auth/me/profile', {
    method: 'PUT',
    body: JSON.stringify(payload),
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!data) {
    throw new Error('Failed to update profile');
  }

  return data;
};

export const deleteAccount = async (payload: { currentPassword: string }) => {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  if (!token) {
    throw new Error('No token found');
  }

  const { data } = await authRequest<{ id: string }>('auth/me', {
    method: 'DELETE',
    body: JSON.stringify(payload),
    headers: { Authorization: `Bearer ${token}` },
  });

  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);

  return data;
};
