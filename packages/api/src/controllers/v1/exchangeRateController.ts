import { NextFunction, Request, Response } from 'express';
import * as exchangeRateService from '../../services/v1/exchangeRateService';
import { PaginationProps } from '../../types/commonTypes';
import { Types } from 'mongoose';

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = exchangeRateService.create(req.body);

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

    const result = exchangeRateService.getAll(query);

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

    const data = exchangeRateService.get(id);

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

    const data = exchangeRateService.update(id, req.body);

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

    const data = exchangeRateService.remove(id);

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};

export { create, getAll, get, update, remove };
