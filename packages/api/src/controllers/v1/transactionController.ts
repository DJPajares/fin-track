import { NextFunction, Request, Response } from 'express';
import * as transactionService from '../../services/v1/transactionService';
import type { QueryParamsProps } from '../../types/commonTypes';
import { Types } from 'mongoose';

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await transactionService.create(req.body);

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};

const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = req.query as unknown as QueryParamsProps;

    const result = await transactionService.getAll(query);

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
      data
    });
  } catch (error) {
    next(error);
  }
};

const getByCategoryDate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await transactionService.getByCategoryDate(req.body);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getByTypeDateRange = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await transactionService.getByTypeDateRange(req.body);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getByCategoryDateRange = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await transactionService.getByCategoryDateRange(req.body);

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
      data
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
      data
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
      data
    });
  } catch (error) {
    next(error);
  }
};

export {
  create,
  getAll,
  getAdvanced,
  getByCategoryDate,
  getByTypeDateRange,
  getByCategoryDateRange,
  get,
  update,
  remove
};
