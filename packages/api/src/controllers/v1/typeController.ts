import { Request, Response, NextFunction } from 'express';
import * as typeService from '../../services/v1/typeService';
import { Types } from 'mongoose';
import type { QueryParamsProps } from '../../types/commonTypes';

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await typeService.create(req.body);

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
    const data = await typeService.createMany(req.body);

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

    const result = await typeService.getAll(query);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const get = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const _id = new Types.ObjectId(req.params.id);

    const data = await typeService.get(_id);

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
    const _id = new Types.ObjectId(req.params.id);

    const data = await typeService.update(_id, req.body);

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
    const _id = new Types.ObjectId(req.params.id);

    const data = await typeService.remove(_id);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export { create, createMany, getAll, get, update, remove };
