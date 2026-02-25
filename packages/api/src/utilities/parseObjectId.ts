import { Types } from 'mongoose';

const parseObjectId = (idParam: string | string[] | undefined) => {
  const id = Array.isArray(idParam) ? idParam[0] : idParam;

  if (!id || !Types.ObjectId.isValid(id)) {
    return null;
  }

  return new Types.ObjectId(id);
};

export default parseObjectId;
