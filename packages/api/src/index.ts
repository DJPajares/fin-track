import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import router from './routes';
import errorHandler from './middleware/errorHandler';
import { getDatabaseConfig } from './config/databaseConfig';

dotenv.config();

const app = express();

const port = process.env.PORT || 3000;

// const corsOptions = {
//   origin: 'http://localhost:3000',
//   credentials: true, //access-control-allow-credentials:true
//   optionSuccessStatus: 200
// };

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
    // Get database config based on Git branch
    const dbConfig = getDatabaseConfig();

    console.log(
      `Connecting to database: ${dbConfig.name} (${dbConfig.description})`,
    );
    await mongoose.connect(dbConfig.url);
    console.log(`Successfully connected to ${dbConfig.name} database`);

    app.listen(port, () => {
      console.log(`[server]: Server is running at http://localhost:${port}`);
      console.log(`[database]: Using ${dbConfig.name} database`);
    });
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

start();
