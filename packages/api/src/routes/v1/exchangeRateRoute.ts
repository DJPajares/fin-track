import express from 'express';
import {
  create,
  getAll,
  get,
  update,
  remove,
  getLatest,
} from '../../controllers/v1/exchangeRateController';

const router = express.Router();

router.post('/', create);

router.get('/', getAll);

router.get('/latest', getLatest);

router.get('/:id', get);

router.put('/:id', update);

router.delete('/:id', remove);

export default router;
