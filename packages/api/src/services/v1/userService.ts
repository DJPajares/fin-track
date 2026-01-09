import { UserModel } from '../../models/v1/userModel';
import type {
  CreateUserBody,
  UpdateUserBody,
} from '../../types/v1/userRequestTypes';

const create = async (data: CreateUserBody) => {
  return await UserModel.create(data);
};

const getAll = async () => {
  return await UserModel.find();
};

const get = async (id: string) => {
  return await UserModel.findOne({ id });
};

const update = async (id: string, data: UpdateUserBody) => {
  return await UserModel.findOneAndUpdate({ id }, data, {
    new: true,
  });
};

const remove = async (id: string) => {
  return await UserModel.findOneAndDelete({ id });
};

export { create, getAll, get, update, remove };
