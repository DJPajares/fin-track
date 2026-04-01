import express from 'express';

import {
  create,
  createCustom,
  createMany,
  get,
  getAll,
  getByType,
  getSpecificType,
  remove,
  update,
} from '../../controllers/v1/categoryController';

const router = express.Router();

router.post('/', create);

router.post('/batch-create', createMany);

router.post('/custom', createCustom);

router.get('/types/', getByType);

router.get('/types/:id', getSpecificType);

router.get('/:id', get);

router.get('/', getAll);

router.put('/:id', update);

router.delete('/:id', remove);

export default router;
