import express from 'express';
import {
  create,
  createMany,
  getAll,
  get,
  update,
  remove,
} from '../../controllers/v1/typeController';

const router = express.Router();

router.post('/', create);

router.post('/batch-create', createMany);

router.get('/', getAll);

router.get('/:id', get);

router.put('/:id', update);

router.delete('/:id', remove);

export default router;
