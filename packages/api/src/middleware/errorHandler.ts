import { NextFunction, Request, Response } from 'express';
import { Error } from 'mongoose';

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
    message: errorMessage,
  });
};

const mongoServerErrorHandler = (error: MongoServerError, res: Response) => {
  const value = error.keyValue?.name;

  return res.status(400).send({
    type: 'MongoServerError',
    message: `${value} is already used`,
  });
};

const errorHandler = (
  error: ValidationError | MongoServerError | Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  void next;
  if (error.name === 'ValidationError') {
    validationErrorHandler(error as ValidationError, res);
    return;
  }

  if (error.name === 'MongoServerError') {
    if ((error as MongoServerError).code === 11000) {
      mongoServerErrorHandler(error, res);
    } else {
      res.status(500).send({
        message: (error as MongoServerError).message,
      });
    }
    return;
  }

  res.status(500).send({
    message: 'Something went wrong',
    error,
  });
};

export default errorHandler;
