import type { AuthResponse } from '@shared/types/Auth';
import { Request } from 'express';

type RequestWithUser = Request & { user: AuthResponse };

export type { RequestWithUser };
