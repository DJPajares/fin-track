import express from 'express';
import { createTypes, getTypes } from '../../services/types';

const router = express.Router();

// get all
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

// delete

export default router;
