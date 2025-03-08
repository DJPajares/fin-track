import express from 'express';
import {
  create,
  createMany,
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

router.post('/batch-create', createMany);

router.get('/', getAll);

router.post('/getAdvanced/', getAdvanced);

router.post('/categories-chart', getCategories);

router.post('/monthly-types', getMonthlyTypes);

router.post('/monthly-categories', getMonthlyCategories);

router.get('/:id', get);

router.put('/:id', update);

router.delete('/:id', remove);

export default router;
