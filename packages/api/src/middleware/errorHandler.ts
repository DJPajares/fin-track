import { Request, Response, NextFunction } from 'express';

const validationErrorHandler = (error: any, res: Response) => {
  const errors = Object.values(error.errors).map((err: any) => err.message);
  const errorMessages = errors.join('. ');
  const errorMessage = `Invalid data: ${errorMessages}`;

  return res.status(400).send({
    type: 'ValidationError',
    success: false,
    message: errorMessage
  });
};

const mongoServerErrorHandler = (error: any, res: Response) => {
  const value = error.keyValue.name;

  return res.status(400).send({
    type: 'MongoServerError',
    success: false,
    message: `${value} is already used`
  });
};

const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error.name === 'ValidationError') {
    validationErrorHandler(error, res);
  }

  if (error.name === 'MongoServerError' && error.code === 11000) {
    mongoServerErrorHandler(error, res);
  }

  return res.status(500).send({
    success: false,
    message: 'Something went wrong'
  });
};

export default errorHandler;
