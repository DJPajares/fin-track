import { Request } from 'express';

type AuthUser = {
  id: string; // MongoDB ObjectId as string
  email?: string | null;
  name?: string | null;
  image?: string | null;
};

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
