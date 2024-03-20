import { Type } from '../../mongoose/models/models';
import { TypeProps } from '../../mongoose/interfaces/interfaces';

const createType = async (data: TypeProps) => {
  try {
    await Type.create(data);
  } catch (error) {
    console.error(error);
    throw new Error('Could not create type');
  }
};

export default {
  createType
};
