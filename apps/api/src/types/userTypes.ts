import { Request } from 'express';

import type { AuthResponse } from '../../../../packages/shared/types/Auth';

type RequestWithUser = Request & { user: AuthResponse };

export type { RequestWithUser };
