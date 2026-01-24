import { Request } from 'express';
import type { AuthResponse } from '../../../../shared/types/Auth';

type RequestWithUser = Request & { user: AuthResponse };

export type { RequestWithUser };
