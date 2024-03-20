import { Type } from '../../mongoose/models/type';
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

const updateTypes = async (data: TypeProps) => {
  try {
    const { _id, name } = data;

    await Type.updateOne({ _id }, { name });
  } catch (error) {
    console.error(error);
    throw new Error('Could not update types');
  }
};

export { createTypes, getTypes, updateTypes };
