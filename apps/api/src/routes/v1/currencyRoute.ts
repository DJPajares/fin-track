import express from 'express';

import {
  create,
  createMany,
  get,
  getAll,
  getByName,
  remove,
  update,
} from '../../controllers/v1/currencyController';

const router = express.Router();

router.post('/', create);

router.post('/batch-create', createMany);

router.get('/', getAll);

router.get('/by-name/:name', getByName);

router.get('/:id', get);

router.put('/:id', update);

router.delete('/:id', remove);

export default router;
