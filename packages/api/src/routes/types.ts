import express from 'express';
import { createType, getType, updateType, deleteType } from '../services/types';

const router = express.Router();

// create
router.post('/', async (req, res, next) => {
  try {
    const data = await createType(req.body);

    res.status(200).send({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
});

// read
router.get('/', async (req, res, next) => {
  try {
    const data = await getType(req);

    res.status(200).send({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
});

// update
router.put('/', async (req, res, next) => {
  try {
    const data = await updateType(req.body);

    res.status(200).send({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
});

// delete
router.delete('/', async (req, res, next) => {
  try {
    const data = await deleteType(req.body);

    res.status(200).send({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
});

export default router;
