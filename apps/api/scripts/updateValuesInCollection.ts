import * as dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

/**
 * Script to add or update key-value pairs in a MongoDB collection.
 *
 * Usage:
 * > npx
 * npx ts-node packages/api/scripts/updateValuesInCollection.ts <collection> <operation> <key1:value1> [key2:value2] ...
 * > package.json
 * npm run update-values-in-collection -- <collection> <operation> <key1:value1> [key2:value2] ...
 *
 * Operations:
 * - add: Adds new keys to all documents (useful for adding new fields)
 * - update: Updates existing keys with new values in all documents
 *
 * Example:
 * > npx
 * npx ts-node packages/api/scripts/updateValuesInCollection.ts categories add scope:default
 * npx ts-node packages/api/scripts/updateValuesInCollection.ts categories update scope:custom
 * npx ts-node packages/api/scripts/updateValuesInCollection.ts transactions add status:pending update priority:high
 * > package.json
 * npm run update-values-in-collection -- categories add scope:default
 * npm run update-values-in-collection -- categories update scope:custom
 *
 * Make sure to set the DATABASE_URL environment variable before running the script.
 */

dotenv.config();

async function updateValuesInCollection() {
  const args = process.argv.slice(2);

  if (args.length < 3) {
    console.error(
      'Error: Missing arguments.\n\nUsage:\n' +
        'npx ts-node updateValuesInCollection.ts <collection> <operation> <key1:value1> [key2:value2] ...\n\n' +
        'Operations:\n' +
        '  add    - Adds new keys to all documents\n' +
        '  update - Updates existing keys with new values\n\n' +
        'Example:\n' +
        'npx ts-node updateValuesInCollection.ts categories add scope:default\n' +
        'npx ts-node updateValuesInCollection.ts categories update scope:custom',
    );
    process.exit(1);
  }

  const collectionName = args[0];
  const operation = args[1].toLowerCase();

  if (!['add', 'update'].includes(operation)) {
    console.error(
      `Error: Invalid operation "${operation}". Expected "add" or "update".`,
    );
    process.exit(1);
  }

  const keyValuePairs: Record<string, unknown> = {};

  // Parse key-value pairs from remaining arguments
  for (let i = 2; i < args.length; i++) {
    const pair = args[i].split(':');
    if (pair.length !== 2) {
      console.error(
        `Error: Invalid key-value pair format: "${args[i]}". Expected format: "key:value"`,
      );
      process.exit(1);
    }
    const [key, value] = pair;

    // Try to parse value as JSON, otherwise treat as string
    let parsedValue: unknown;
    try {
      parsedValue = JSON.parse(value);
    } catch {
      parsedValue = value;
    }

    keyValuePairs[key] = parsedValue;
  }

  const mongoUri = process.env.DATABASE_URL;
  if (!mongoUri) {
    console.error('Error: DATABASE_URL environment variable is not set.');
    process.exit(1);
  }

  const client = new MongoClient(mongoUri);

  try {
    await client.connect();
    const db = client.db();
    const collection = db.collection(collectionName);

    console.log(`Operation: ${operation}`);
    console.log(`Collection: ${collectionName}`);
    console.log(`Key-value pairs:`, keyValuePairs);
    console.log('');

    let result;

    if (operation === 'add') {
      // Add operation: use $set to add/merge fields
      result = await collection.updateMany({}, { $set: keyValuePairs });
      console.log(`✅ Add operation completed successfully!`);
    } else {
      // Update operation: use $set to update fields
      result = await collection.updateMany({}, { $set: keyValuePairs });
      console.log(`✅ Update operation completed successfully!`);
    }

    console.log(`   Matched documents: ${result.matchedCount}`);
    console.log(`   Modified documents: ${result.modifiedCount}`);
  } catch (error) {
    console.error('Error updating collection:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

updateValuesInCollection();
