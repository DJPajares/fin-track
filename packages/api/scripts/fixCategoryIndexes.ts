/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || process.env.DATABASE_URL;

if (!MONGODB_URI) {
  console.error(
    'MONGODB_URI or DATABASE_URL is not defined in environment variables',
  );
  process.exit(1);
}

async function fixCategoryIndexes() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db?.collection('categories');

    if (!collection) {
      throw new Error('Categories collection not found');
    }

    // Get existing indexes
    const existingIndexes = await collection.indexes();
    console.log('Existing indexes:', JSON.stringify(existingIndexes, null, 2));

    // Drop all indexes except _id (which cannot be dropped)
    const indexesToDrop = existingIndexes
      .filter((index: any) => index.name !== '_id_')
      .map((index: any) => index.name);

    for (const indexName of indexesToDrop) {
      console.log(`Dropping index: ${indexName}`);
      await collection.dropIndex(indexName);
    }

    console.log('All old indexes dropped');

    // Create the correct indexes
    console.log('Creating new indexes...');

    // 1. Ensure global category IDs are unique
    await collection.createIndex(
      { scope: 1, id: 1 },
      {
        unique: true,
        partialFilterExpression: { scope: 'global' },
        name: 'scope_1_id_1_global',
      },
    );
    console.log('Created index: scope_1_id_1_global');

    // 2. Ensure global category names are unique
    await collection.createIndex(
      { scope: 1, name: 1 },
      {
        unique: true,
        partialFilterExpression: { scope: 'global' },
        name: 'scope_1_name_1_global',
      },
    );
    console.log('Created index: scope_1_name_1_global');

    // 3. Ensure each user cannot create duplicate custom category IDs
    await collection.createIndex(
      { userId: 1, id: 1 },
      {
        unique: true,
        partialFilterExpression: { scope: 'custom' },
        name: 'userId_1_id_1_custom',
      },
    );
    console.log('Created index: userId_1_id_1_custom');

    // 4. Ensure each user cannot create duplicate custom category names
    await collection.createIndex(
      { userId: 1, name: 1 },
      {
        unique: true,
        partialFilterExpression: { scope: 'custom' },
        name: 'userId_1_name_1_custom',
      },
    );
    console.log('Created index: userId_1_name_1_custom');

    // 5. Create indexes for frequently queried fields
    await collection.createIndex({ scope: 1 }, { name: 'scope_1' });
    console.log('Created index: scope_1');

    const newIndexes = await collection.indexes();
    console.log('\nNew indexes:', JSON.stringify(newIndexes, null, 2));

    console.log('\n✅ Category indexes fixed successfully!');
  } catch (error) {
    console.error('Error fixing category indexes:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

fixCategoryIndexes();
