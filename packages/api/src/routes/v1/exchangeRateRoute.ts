import express from 'express';
import {
  create,
  getAll,
  get,
  update,
  remove,
  getLatest,
  updateToLatest,
} from '../../controllers/v1/exchangeRateController';

const router = express.Router();

router.post('/', create);

router.get('/', getAll);

router.get('/latest', getLatest);

router.put('/latest', updateToLatest);

router.get('/:id', get);

router.put('/:id', update);

router.delete('/:id', remove);

export default router;
