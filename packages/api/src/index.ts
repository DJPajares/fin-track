import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import router from './routes';
import errorHandler from './middleware/errorHandler';

dotenv.config();

const app = express();

const port = process.env.PORT;
const databaseUrl =
  process.env.DATABASE_URL || 'mongodb://localhost:27017/fintrack';

// Middleware
app.use(cors());
app.use(express.json());
app.use(router);
app.use(errorHandler);

app.get('/', (req, res) => {
  res.send('API is working!');
});

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
