import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import { PaymentModel } from '../src/models/v1/paymentModel';

dotenv.config();

const USER_ID = '69609f8259e099edd12bc995';
const databaseUrl =
  process.env.DATABASE_URL || 'mongodb://localhost:27017/fintrack';

const main = async () => {
  try {
    await mongoose.connect(databaseUrl);

    const result = await PaymentModel.updateMany(
      {},
      {
        $set: { userId: USER_ID },
      },
    );

    console.log('Payments updated', {
      matched: result.matchedCount,
      modified: result.modifiedCount,
    });
  } catch (error) {
    console.error('Failed to update payments', error);
  } finally {
    await mongoose.disconnect();
  }
};

void main();
