import * as dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

/**
 * Script to update/rename keys in a MongoDB collection.
 *
 * Usage:
 * > npx
 * npx ts-node packages/api/scripts/updateKeysInCollection.ts <collection> <oldKey1>:<newKey1> [oldKey2:newKey2] ...
 * > package.json
 * npm run update-keys-in-collection -- <collection> <oldKey1>:<newKey1> [oldKey2:newKey2] ...
 *
 * Example:
 * > npx
 * npx ts-node packages/api/scripts/updateKeysInCollection.ts categories active:isActive
 * npx ts-node packages/api/scripts/updateKeysInCollection.ts transactions type:transactionType status:transactionStatus
 * > package.json
 * npm run update-keys-in-collection -- categories active:isActive
 * npm run update-keys-in-collection -- transactions type:transactionType status:transactionStatus
 *
 * Make sure to set the DATABASE_URL environment variable before running the script.
 */

dotenv.config();

async function updateKeysInCollection() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.error(
      'Error: Missing arguments.\n\nUsage:\n' +
        'npx ts-node updateKeysInCollection.ts <collection> <oldKey1>:<newKey1> [oldKey2:newKey2] ...\n\n' +
        'Example:\n' +
        'npx ts-node updateKeysInCollection.ts categories active:isActive\n' +
        'npx ts-node updateKeysInCollection.ts transactions type:transactionType status:transactionStatus',
    );
    process.exit(1);
  }

  const collectionName = args[0];
  const keyMappings: Record<string, string> = {};

  // Parse key mappings from remaining arguments
  for (let i = 1; i < args.length; i++) {
    const mapping = args[i].split(':');
    if (mapping.length !== 2) {
      console.error(
        `Error: Invalid key mapping format: "${args[i]}". Expected format: "oldKey:newKey"`,
      );
      process.exit(1);
    }
    const [oldKey, newKey] = mapping;
    keyMappings[oldKey] = newKey;
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

    // Build the update object for MongoDB $rename operator
    const updateObj: Record<string, string> = {};
    for (const [oldKey, newKey] of Object.entries(keyMappings)) {
      updateObj[oldKey] = newKey;
    }

    console.log(`Updating collection: ${collectionName}`);
    console.log(`Key mappings:`, keyMappings);

    // Update all documents in the collection
    const result = await collection.updateMany({}, { $rename: updateObj });

    console.log(`\n✅ Update completed successfully!`);
    console.log(`   Matched documents: ${result.matchedCount}`);
    console.log(`   Modified documents: ${result.modifiedCount}`);
  } catch (error) {
    console.error('Error updating collection:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

updateKeysInCollection();
