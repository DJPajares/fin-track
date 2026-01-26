import express from 'express';
import {
  create,
  createMany,
  createCustom,
  getAll,
  get,
  getByType,
  getSpecificType,
  update,
  remove,
} from '../../controllers/v1/categoryController';
import { RequestWithUser } from '../../types/userTypes';

const router = express.Router();

router.post('/', create);

router.post('/batch-create', createMany);

router.post('/custom', createCustom);

router.get('/types/', getByType);

router.get('/types/:id', getSpecificType);

router.get('/:id', get);

router.get('/', (req, res, next) => getAll(req as RequestWithUser, res, next));

router.put('/:id', update);

router.delete('/:id', remove);

export default router;
