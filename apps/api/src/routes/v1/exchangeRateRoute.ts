import express from 'express';

import {
  create,
  get,
  getAll,
  getLatest,
  remove,
  update,
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
