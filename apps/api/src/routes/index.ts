import express from 'express';

import authRoute from './v1/authRoute';
import categoryRoute from './v1/categoryRoute';
import currencyRoute from './v1/currencyRoute';
import exchangeRateRoute from './v1/exchangeRateRoute';
import paymentRoute from './v1/paymentRoute';
import transactionPaymentRoute from './v1/transactionPaymentRoute';
import transactionRoute from './v1/transactionRoute';
import typesRoute from './v1/typeRoute';
import userRoute from './v1/userRoute';

const router = express.Router();

router.use('/api/v1/auth', authRoute);
router.use('/api/v1/types', typesRoute);
router.use('/api/v1/categories', categoryRoute);
router.use('/api/v1/currencies', currencyRoute);
router.use('/api/v1/payments', paymentRoute);
router.use('/api/v1/transactions', transactionRoute);
router.use('/api/v1/transaction-payments', transactionPaymentRoute);
router.use('/api/v1/exchange-rates', exchangeRateRoute);
router.use('/api/v1/users', userRoute);

export default router;
