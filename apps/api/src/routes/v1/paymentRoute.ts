import express from 'express';

import {
  create,
  get,
  getAll,
  remove,
  update,
  upsertMany,
} from '../../controllers/v1/paymentController';

const router = express.Router();

router.post('/', create);

router.get('/', getAll);

router.get('/:id', get);

router.put('/:id', update);

router.put('/', upsertMany);

router.delete('/:id', remove);

export default router;
