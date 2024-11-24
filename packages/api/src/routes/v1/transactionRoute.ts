import express from 'express';
import {
  create,
  getAll,
  getAdvanced,
  getTransactionsByCategory,
  get,
  update,
  remove
} from '../../controllers/v1/transactionController';

const router = express.Router();

router.post('/', create);

router.get('/', getAll);

router.post('/getAdvanced/', getAdvanced);

router.post('/getTransactionsByCategory', getTransactionsByCategory);

router.get('/:id', get);

router.put('/:id', update);

router.delete('/:id', remove);

export default router;
