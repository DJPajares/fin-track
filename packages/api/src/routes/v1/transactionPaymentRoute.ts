import express from 'express';
import {
  fetchTransactionPayments,
  fetchMonthlyByCategory,
} from '../../controllers/v1/transactionPaymentController';

const router = express.Router();

router.post('/', fetchTransactionPayments);

router.post('/monthly-by-category/:category', fetchMonthlyByCategory);

export default router;
