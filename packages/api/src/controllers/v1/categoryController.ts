import { NextFunction, Request, Response } from 'express';
import * as categoryService from '../../services/v1/categoryService';
import { Types } from 'mongoose';
import type {
  PaginationProps,
  QueryParamsProps
} from '../../types/commonTypes';
import type { SpecificTypeProps } from '../../types/categoryTypes';

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await categoryService.create(req.body);

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};

const getAll = async (req: Request, res: Response, next: NextFunction) => {
  console.log('getAll');
  try {
    const query = req.query as unknown as QueryParamsProps;

    const result = await categoryService.getAll(query);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const get = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = new Types.ObjectId(req.params.id);

    const data = await categoryService.get(id);

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};

const getByType = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = req.query as unknown as QueryParamsProps;

    const result = await categoryService.getByType(query);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getSpecificType = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = new Types.ObjectId(req.params.id);
    const query = req.query as unknown as QueryParamsProps;

    const result = await categoryService.getSpecificType(id, query);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = new Types.ObjectId(req.params.id);

    const data = await categoryService.update(id, req.body);

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

    const data = await categoryService.remove(id);

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};

export { create, getAll, get, getByType, getSpecificType, update, remove };
