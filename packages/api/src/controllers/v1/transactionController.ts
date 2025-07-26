import { NextFunction, Request, Response } from 'express';
import * as transactionService from '../../services/v1/transactionService';
import type { QueryParamsProps } from '../../types/commonTypes';
import { Types } from 'mongoose';
import { AuthenticatedRequest } from '../../types/authTypes';

const create = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    const data = await transactionService.create(req.body, req.user.id);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

const createMany = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    const data = await transactionService.createMany(req.body, req.user.id);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getAll = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    const query = req.query as unknown as QueryParamsProps;

    const result = await transactionService.getAll(query, req.user.id);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getAdvanced = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = req.query as unknown as QueryParamsProps;

    const data = await transactionService.getAdvanced(query, req.body);

    res.status(200).json({
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getCategories = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await transactionService.getCategories(req.body);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getMonthlyTypes = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await transactionService.getMonthlyTypes(req.body);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getMonthlyCategories = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await transactionService.getMonthlyCategories(req.body);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const get = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = new Types.ObjectId(req.params.id);

    const data = await transactionService.get(id);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = new Types.ObjectId(req.params.id);

    const data = await transactionService.update(id, req.body);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = new Types.ObjectId(req.params.id);

    const data = transactionService.remove(id);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export {
  create,
  createMany,
  getAll,
  getAdvanced,
  getCategories,
  getMonthlyTypes,
  getMonthlyCategories,
  get,
  update,
  remove,
};
