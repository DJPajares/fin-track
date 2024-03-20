import express from 'express';
// import items here
import types from './types';
import categories from './categories';

const router = express.Router();

// insert routes here
router.use('/api/types', types);
router.use('/api/categories', categories);

export default router;
