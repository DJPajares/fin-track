import express from 'express';
import {
  create,
  getAll,
  getAdvanced,
  getCategories,
  getMonthlyTypes,
  getMonthlyCategories,
  get,
  update,
  remove,
} from '../../controllers/v1/transactionController';

const router = express.Router();

router.post('/', create);

router.get('/', getAll);

router.post('/getAdvanced/', getAdvanced);

router.post('/getCategories', getCategories);

router.post('/getMonthlyTypes', getMonthlyTypes);

router.post('/getMonthlyCategories', getMonthlyCategories);

router.get('/:id', get);

router.put('/:id', update);

router.delete('/:id', remove);

export default router;
