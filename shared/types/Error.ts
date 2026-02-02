export enum ErrorCode {
  DUPLICATE_CATEGORY = 'DUPLICATE_CATEGORY',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  CATEGORY_ID_EXISTS_GLOBAL = 'CATEGORY_ID_EXISTS_GLOBAL',
  // Add more codes as needed
}

export type ErrorProps = {
  type?: string;
  code?: ErrorCode | string;
  message: string;
  userMessageKey?: string;
};

// Shared error class for backend/frontend
export class AppError extends Error {
  code: ErrorCode | string;
  status: number;

  constructor(code: ErrorCode | string, status = 400, message?: string) {
    super(message || code);
    this.code = code;
    this.status = status;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}
