import { NextFunction, Request, Response } from 'express';
import * as currencyService from '../../services/v1/currencyService';
import { Types } from 'mongoose';

import type { QueryParamsProps } from '../../types/commonTypes';

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await currencyService.create(req.body);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

const createMany = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await currencyService.createMany(req.body);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = req.query as unknown as QueryParamsProps;

    const result = await currencyService.getAll(query);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const get = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = new Types.ObjectId(req.params.id);

    const data = await currencyService.get(id);

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

    const data = await currencyService.update(id, req.body);

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

    const data = await currencyService.remove(id);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export { create, createMany, getAll, get, update, remove };
