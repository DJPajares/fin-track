import { LocaleProps } from '@shared/types/Locale';

export type AuthResponse = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  password?: string;
  lastLoginAt?: Date | null;
  settings?: {
    language?: LocaleProps | null;
    currency?: string | null;
    darkMode?: boolean | null;
  };
};

export type AuthTokenResponse = {
  user: AuthResponse;
  token: string;
};

export type AuthRequest = {
  name?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
};

export type AuthSignupRequest = {
  email: string;
  password: string;
  name?: string;
};

export type AuthLoginRequest = {
  email: string;
  password: string;
};

export type AuthUpdateRequest = {
  name?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
};

export type AuthSettingsRequest = {
  language?: LocaleProps;
  currency?: string;
  darkMode?: boolean;
};
