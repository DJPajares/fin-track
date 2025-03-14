import { NextFunction, Request, Response } from 'express';
import * as transactionPaymentService from '../../services/v1/transactionPaymentService';

const fetchTransactionPayments = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await transactionPaymentService.fetchTransactionPayments(
      req.body,
    );

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

const fetchMonthlyByCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await transactionPaymentService.fetchMonthlyByCategory(
      req.body,
      req.params.category,
    );

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export { fetchTransactionPayments, fetchMonthlyByCategory };
