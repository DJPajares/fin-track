import { NextFunction, Request, Response } from 'express';
import * as userService from '../../services/v1/userService';
import type {
  CreateUserBody,
  UpdateUserBody,
  UserParams,
} from '../../types/v1/userRequestTypes';

const create = async (
  req: Request<unknown, unknown, CreateUserBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await userService.create(req.body);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getAll = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await userService.getAll();

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

const get = async (
  req: Request<UserParams>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await userService.get(req.params.id);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

const update = async (
  req: Request<UserParams, unknown, UpdateUserBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await userService.update(req.params.id, req.body);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (
  req: Request<UserParams>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await userService.remove(req.params.id);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export { create, getAll, get, update, remove };
