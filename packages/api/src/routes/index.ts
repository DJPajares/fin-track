import express from 'express';
// import items here
import types from './items/types';
import categories from './items/categories';

const router = express.Router();

// insert routes here
router.use('/api/types', types);
router.use('/api/categories', categories);

export default router;
