import { NextFunction, Request, Response } from 'express';

import * as currencyService from '../../services/v1/currencyService';
import type { QueryParamsProps } from '../../types/commonTypes';
import parseObjectId from '../../utilities/parseObjectId';

const parseStringParam = (param: string | string[] | undefined) => {
  const value = Array.isArray(param) ? param[0] : param;

  return value?.trim() ? value : null;
};

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await currencyService.create(req.body);

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const createMany = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await currencyService.createMany(req.body);

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = req.query as unknown as QueryParamsProps;

    const data = await currencyService.getAll(query);

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const get = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseObjectId(req.params.id);

    if (!id) {
      res.status(400).json({ message: 'Invalid currency id' });
      return;
    }

    const data = await currencyService.get(id);

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const getByName = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const name = parseStringParam(req.params.name);

    if (!name) {
      res.status(400).json({ message: 'Invalid currency name' });
      return;
    }

    const data = await currencyService.getByName(name);

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseObjectId(req.params.id);

    if (!id) {
      res.status(400).json({ message: 'Invalid currency id' });
      return;
    }

    const data = await currencyService.update(id, req.body);

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseObjectId(req.params.id);

    if (!id) {
      res.status(400).json({ message: 'Invalid currency id' });
      return;
    }

    const data = await currencyService.remove(id);

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export { create, createMany, get, getAll, getByName, remove, update };
