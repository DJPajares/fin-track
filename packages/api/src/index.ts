import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import routes from './routes';

dotenv.config();

const app = express();

const port = process.env.PORT;
const databaseUrl =
  process.env.MONGOOSE_DATABASE_URL || 'mongodb://127.0.0.1/fintrack';

// app.get('/', (req, res) => {
//   res.send('Express + TypeScript Server');
// });

// Middleware
app.use(express.json());
// app.use(routes);

const start = async () => {
  try {
    // await mongoose.connect(databaseUrl);
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
