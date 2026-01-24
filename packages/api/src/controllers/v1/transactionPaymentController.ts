import { NextFunction, Request, Response } from 'express';
import * as transactionPaymentService from '../../services/v1/transactionPaymentService';

import type {
  DateCurrencyProps,
  DateRangeCurrencyProps,
} from '../../types/v1/transactionPaymentRequestTypes';

const fetchTransactionPayments = async (
  req: Request<unknown, unknown, DateCurrencyProps>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await transactionPaymentService.fetchTransactionPayments(
      req.body,
    );

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const fetchMonthlyByCategory = async (
  req: Request<{ category: string }, unknown, DateRangeCurrencyProps>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await transactionPaymentService.fetchMonthlyByCategory(
      req.body,
      req.params.category,
    );

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export { fetchTransactionPayments, fetchMonthlyByCategory };
