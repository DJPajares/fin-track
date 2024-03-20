import express from 'express';
import { createTypes, getTypes, updateTypes } from '../services/types';

const router = express.Router();

// create
router.post('/', async (req, res, next) => {
  try {
    const data = await createTypes(req.body);

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
    const data = await getTypes(req);

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
    const data = await updateTypes(req.body);

    res.status(200).send({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
});

// delete

export default router;
