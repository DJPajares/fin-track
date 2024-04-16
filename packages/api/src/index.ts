import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import router from './routes';
import errorHandler from './middleware/errorHandler';

dotenv.config();

const app = express();

const port = process.env.PORT || 3001;
const databaseUrl = process.env.DATABASE_URL || 'mongodb://127.0.0.1/database';

// Middleware
app.use(express.json());
app.use(router);
app.use(errorHandler);

const start = async () => {
  try {
    await mongoose.connect(databaseUrl);

    app.listen(port, () => {
      console.log(`[server]: Server is running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();
