import { NextFunction, Request, Response } from 'express';
import { Error } from 'mongoose';
import { ErrorCode } from '../../../../shared/types/Error';

interface ValidationError extends Error.ValidationError {
  errors: {
    [key: string]: Error.ValidatorError;
  };
}

interface MongoServerError extends Error {
  code?: number;
  keyValue?: Record<string, string>;
}

const validationErrorHandler = (error: ValidationError, res: Response) => {
  const errors = Object.values(error.errors).map((err) => err.message);
  const errorMessages = errors.join('. ');
  const errorMessage = `Invalid data: ${errorMessages}`;

  return res.status(400).send({
    type: 'ValidationError',
    code: ErrorCode.VALIDATION_ERROR,
    message: errorMessage,
    userMessageKey: 'Common.error.validation',
  });
};

const mongoServerErrorHandler = (error: MongoServerError, res: Response) => {
  const keyValue = error.keyValue;
  if (keyValue) {
    const fields = Object.keys(keyValue);

    // For compound indexes, provide a more descriptive message
    if (fields.length > 1) {
      const fieldValuePairs = fields
        .map((field) => `${field}: '${keyValue[field]}'`)
        .join(', ');
      return res.status(400).send({
        type: 'MongoServerError',
        code: ErrorCode.DUPLICATE_CATEGORY,
        message: `A category with the same ${fields.join(' and ')} already exists (${fieldValuePairs})`,
        userMessageKey: 'Common.error.duplicateCategory',
      });
    }

    // For single field indexes
    const field = fields[0];
    const value = keyValue[field];
    return res.status(400).send({
      type: 'MongoServerError',
      code: ErrorCode.DUPLICATE_CATEGORY,
      message: `${field} '${value}' is already used`,
      userMessageKey: 'Common.error.duplicateCategory',
    });
  }

  return res.status(400).send({
    type: 'MongoServerError',
    code: ErrorCode.DUPLICATE_CATEGORY,
    message: 'Duplicate key error',
    userMessageKey: 'Common.error.duplicateCategory',
  });
};

const errorHandler = (
  error: ValidationError | MongoServerError | Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  void next;

  const statusCode = (error as Error & { statusCode?: number }).statusCode;
  if (statusCode) {
    res.status(statusCode).send({
      type: error.name,
      code: (error as MongoServerError).code,
      message: error.message,
      userMessageKey: 'Common.error.generic',
    });
    return;
  }

  if (error.name === 'ValidationError') {
    validationErrorHandler(error as ValidationError, res);
    return;
  }

  if (error.name === 'MongoServerError') {
    if ((error as MongoServerError).code === 11000) {
      mongoServerErrorHandler(error, res);
    } else {
      res.status(500).send({
        type: 'MongoServerError',
        code: (error as MongoServerError).code,
        message: (error as MongoServerError).message,
        userMessageKey: 'Common.error.generic',
      });
    }
    return;
  }

  // Handle MongooseError (includes duplicate key errors)
  if (
    error.name === 'MongooseError' ||
    (error as MongoServerError).code === 11000
  ) {
    mongoServerErrorHandler(error as MongoServerError, res);
    return;
  }

  res.status(500).send({
    type: error.name,
    code: (error as MongoServerError).code,
    message: 'Something went wrong',
    userMessageKey: 'Common.error.generic',
    error,
  });
};

export default errorHandler;
