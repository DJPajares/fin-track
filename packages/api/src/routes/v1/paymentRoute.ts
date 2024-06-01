import express from 'express';
import {
  create,
  getAll,
  get,
  update,
  upsertMany,
  remove
} from '../../controllers/v1/paymentController';

const router = express.Router();

router.post('/', create);

router.get('/', getAll);

router.get('/:id', get);

router.put('/:id', update);

router.put('/', upsertMany);

router.delete('/:id', remove);

export default router;
