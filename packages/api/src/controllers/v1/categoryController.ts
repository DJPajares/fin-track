import { NextFunction, Request, Response } from 'express';
import * as categoryService from '../../services/v1/categoryService';
import { Types } from 'mongoose';
import { RequestWithUser } from '../../types/userTypes';

import type { QueryParamsProps } from '../../types/commonTypes';

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await categoryService.create(req.body);

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const createMany = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await categoryService.createMany(req.body);

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const createCustom = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // const { type, id, name, icon, isActive, userId } = req.body;

    // const data = await categoryService.createCustom({
    //   type,
    //   id,
    //   name,
    //   icon,
    //   isActive,
    //   userId,
    // });

    const data = await categoryService.createCustom(req.body);

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const getAll = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction,
) => {
  try {
    const query = req.query as unknown as QueryParamsProps;
    const userId = req.user?.id;

    const data = await categoryService.getAll(query, userId);

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const get = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = new Types.ObjectId(req.params.id);

    const data = await categoryService.get(id);

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const getByType = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = req.query as unknown as QueryParamsProps;

    const data = await categoryService.getByType(query);

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const getSpecificType = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = new Types.ObjectId(req.params.id);
    const query = req.query as unknown as QueryParamsProps;

    const data = await categoryService.getSpecificType(id, query);

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = new Types.ObjectId(req.params.id);

    const data = await categoryService.update(id, req.body);

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = new Types.ObjectId(req.params.id);

    const data = await categoryService.remove(id);

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export {
  create,
  createMany,
  createCustom,
  getAll,
  get,
  getByType,
  getSpecificType,
  update,
  remove,
};
