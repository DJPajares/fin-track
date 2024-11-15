import { Request, Response, NextFunction } from 'express';

const validationErrorHandler = (error: any, res: Response) => {
  const errors = Object.values(error.errors).map((err: any) => err.message);
  const errorMessages = errors.join('. ');
  const errorMessage = `Invalid data: ${errorMessages}`;

  return res.status(400).send({
    type: 'ValidationError',
    message: errorMessage
  });
};

const mongoServerErrorHandler = (error: any, res: Response) => {
  const value = error.keyValue.name;

  return res.status(400).send({
    type: 'MongoServerError',
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

  if (error.name === 'MongoServerError') {
    if (error.code === 11000) {
      mongoServerErrorHandler(error, res);
    } else {
      return res.status(500).send({
        message: error.errmsg
      });
    }
  }

  return res.status(500).send({
    message: 'Something went wrong',
    error
  });
};

export default errorHandler;
