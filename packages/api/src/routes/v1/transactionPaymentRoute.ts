import express from 'express';
import { fetchTransactionPayments } from '../../controllers/v1/transactionPaymentController';

const router = express.Router();

router.post('/', fetchTransactionPayments);

export default router;
