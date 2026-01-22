import { NextFunction, Request, Response } from 'express';
import * as exchangeRateService from '../../services/v1/exchangeRateService';
import type { QueryParamsProps } from '../../types/commonTypes';
import { Types } from 'mongoose';

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await exchangeRateService.create(req.body);

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

    const result = await exchangeRateService.getAll(query);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const get = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = new Types.ObjectId(req.params.id);

    const data = await exchangeRateService.get(id);

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

    const data = await exchangeRateService.update(id, req.body);

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

    const data = await exchangeRateService.remove(id);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getLatest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await exchangeRateService.getLatest();

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

const updateLatest = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await exchangeRateService.updateLatest();

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export { create, getAll, get, update, remove, getLatest, updateLatest };
