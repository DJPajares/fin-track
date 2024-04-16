import { NextFunction, Request, Response } from 'express';
import * as categoryService from '../../services/v1/categoryService';
import { Types } from 'mongoose';
import { PaginationProps } from '../../types/commonTypes';

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
  try {
    const query = req.query as unknown as PaginationProps;

    const result = await categoryService.getAll(query);

    res.status(200).json({
      success: true,
      ...result
    });
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

export { create, getAll, get, update, remove };
