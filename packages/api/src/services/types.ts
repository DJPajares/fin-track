import models from '../../mongoose/models/models';

const { Type } = models;

type Type = {
  name: string;
};

const createType = async (data: Type) => {
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
