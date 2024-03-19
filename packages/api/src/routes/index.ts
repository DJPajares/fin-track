import express from 'express';
// import items here
import categories from './items/categories';

const router = express.Router();

// insert routes here
router.use('/api/employees', categories);

export default router;
