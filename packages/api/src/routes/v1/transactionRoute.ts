import express from 'express';
import {
  create,
  getAll,
  getAdvanced,
  getByCategoryDate,
  getByTypeDateRange,
  getByCategoryDateRange,
  get,
  update,
  remove
} from '../../controllers/v1/transactionController';

const router = express.Router();

router.post('/', create);

router.get('/', getAll);

router.post('/getAdvanced/', getAdvanced);

router.post('/getByCategoryDate', getByCategoryDate);

router.post('/getByTypeDateRange', getByTypeDateRange);

router.post('/getByCategoryDateRange', getByCategoryDateRange);

router.get('/:id', get);

router.put('/:id', update);

router.delete('/:id', remove);

export default router;
