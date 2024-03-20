import { Type } from '../../mongoose/models/models';
import { TypeProps } from '../../mongoose/interfaces/interfaces';
import { Request } from 'express';

const createTypes = async (data: TypeProps) => {
  try {
    await Type.create(data);
  } catch (error) {
    console.error(error);
    throw new Error('Could not create types');
  }
};

const getTypes = async (req: Request) => {
  try {
    return await Type.find({});
  } catch (error) {
    console.error(error);
    throw new Error('Could not get types');
  }
};

export { createTypes, getTypes };
