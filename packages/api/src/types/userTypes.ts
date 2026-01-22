import { Request } from 'express';
import type { AuthUser } from '../../../../shared/types/Auth';

type RequestWithUser = Request & { user: AuthUser };

type LoginCredentials = {
  email: string;
  password: string;
};

type SignupCredentials = {
  email: string;
  password: string;
  name?: string;
};

type AuthResponse = {
  user: AuthUser;
  token: string;
};

export type {
  AuthUser,
  RequestWithUser,
  LoginCredentials,
  SignupCredentials,
  AuthResponse,
};
