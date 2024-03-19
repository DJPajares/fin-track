import express from 'express';
import services from '../../services/types';

const router = express.Router();

const { createType } = services;

// get all

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

// delete

export default router;
