import { Request } from 'express';

type AuthUser = {
  id: string; // Stable auth id (Better Auth compatible)
  email?: string | null;
  name?: string | null;
  image?: string | null;
};

type RequestWithUser = Request & { user: AuthUser };

export type { AuthUser, RequestWithUser };
