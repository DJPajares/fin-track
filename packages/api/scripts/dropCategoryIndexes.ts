import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { CategoryModel } from '../src/models/v1/categoryModel';

dotenv.config();

const dropCategoryIndexes = async () => {
  const dbUri = process.env.DATABASE_URL;

  if (!dbUri) {
    console.error('DATABASE_URL is not defined');
    process.exit(1);
  }

  try {
    await mongoose.connect(dbUri);
    console.log('Connected to MongoDB');

    // Drop all indexes except _id
    await CategoryModel.collection.dropIndexes();
    console.log('All category indexes dropped successfully');

    // The new indexes will be created automatically when the model is used
    // Or you can trigger index creation explicitly:
    await CategoryModel.createIndexes();
    console.log('New indexes created successfully');

    // List current indexes to verify
    const indexes = await CategoryModel.collection.getIndexes();
    console.log('\nCurrent indexes:');
    console.log(JSON.stringify(indexes, null, 2));
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
};

dropCategoryIndexes();
