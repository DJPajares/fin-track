import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import { TransactionModel } from '../src/models/v1/transactionModel';

dotenv.config();

const USER_ID = '69609f8259e099edd12bc995';
const databaseUrl =
  process.env.DATABASE_URL || 'mongodb://localhost:27017/fintrack';

const main = async () => {
  try {
    await mongoose.connect(databaseUrl);

    const result = await TransactionModel.updateMany(
      {},
      {
        $set: { userId: USER_ID },
      },
    );

    console.log('Transactions updated', {
      matched: result.matchedCount,
      modified: result.modifiedCount,
    });
  } catch (error) {
    console.error('Failed to update transactions', error);
  } finally {
    await mongoose.disconnect();
  }
};

void main();
