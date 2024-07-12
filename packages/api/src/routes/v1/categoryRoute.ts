import express from 'express';
import {
  create,
  getAll,
  get,
  getByType,
  getSpecificType,
  update,
  remove
} from '../../controllers/v1/categoryController';

const router = express.Router();

router.post('/', create);

router.get('/', getAll);

router.get('/:id', get);

router.get('/getByType', getByType);

router.get('/:typeId', getSpecificType);

router.put('/:id', update);

router.delete('/:id', remove);

export default router;
