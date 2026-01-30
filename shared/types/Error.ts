export enum ErrorCode {
  DUPLICATE_CATEGORY = 'DUPLICATE_CATEGORY',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  // Add more codes as needed
}

export type ErrorProps = {
  type?: string;
  code?: ErrorCode | string;
  message: string;
  userMessageKey?: string;
};
