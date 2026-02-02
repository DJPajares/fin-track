import * as dotenv from 'dotenv';
import mongoose, { Types } from 'mongoose';
import { CategoryModel } from '../src/models/v1/categoryModel';
import { TypeModel } from '../src/models/v1/typeModel';
import { serializeText } from '../../../shared/utilities/serializeText';

/**
 * Script to seed categories collection.
 *
 * Behavior:
 * 1. Matches on `id` && `scope = 'global'`. If found, updates it. Otherwise inserts new record.
 * 2. Special case: If same `id` is found but scope is undefined, it will be updated.
 * 3. When updating, if data has `active` key, it's migrated to `isActive`.
 *
 * Usage:
 * > npx
 * npx ts-node packages/api/scripts/seedCategories.ts
 * > package.json
 * npm run seed-categories
 *
 * Make sure to set the DATABASE_URL environment variable before running the script.
 */

dotenv.config();

// Sample category seed data
type SeedCategoryData = {
  id?: string;
  name: string;
  icon?: string;
  isActive: boolean;
  scope: 'global' | 'custom';
  userId?: Types.ObjectId;
  typeId: 'income' | 'expense';
};

const SEED_DATA: SeedCategoryData[] = [
  {
    name: 'Paycheck',
    icon: 'briefcase-business',
    scope: 'global',
    isActive: true,
    typeId: 'income',
  },
  {
    name: 'Investment',
    icon: 'coins',
    scope: 'global',
    isActive: true,
    typeId: 'income',
  },
  {
    name: 'Bonus',
    icon: 'gift',
    scope: 'global',
    isActive: true,
    typeId: 'income',
  },
  {
    name: 'Freelance',
    icon: 'briefcase',
    scope: 'global',
    isActive: true,
    typeId: 'income',
  },
  {
    name: 'Food',
    icon: 'utensils',
    isActive: true,
    scope: 'global',
    typeId: 'expense',
  },
  {
    name: 'Entertainment',
    icon: 'popcorn',
    isActive: true,
    scope: 'global',
    typeId: 'expense',
  },
  {
    name: 'Transportation',
    icon: 'bus-front',
    isActive: true,
    scope: 'global',
    typeId: 'expense',
  },
  {
    name: 'Rent',
    icon: 'bed-double',
    isActive: true,
    scope: 'global',
    typeId: 'expense',
  },
  {
    name: 'Utilities',
    icon: 'lightbulb',
    isActive: true,
    scope: 'global',
    typeId: 'expense',
  },
  {
    name: 'Healthcare',
    icon: 'activity',
    isActive: true,
    scope: 'global',
    typeId: 'expense',
  },
  {
    name: 'Insurance',
    icon: 'shield',
    isActive: true,
    scope: 'global',
    typeId: 'expense',
  },
  {
    name: 'Subscription',
    icon: 'clapperboard',
    isActive: true,
    scope: 'global',
    typeId: 'expense',
  },
  {
    name: 'Shopping',
    icon: 'shopping-bag',
    isActive: true,
    scope: 'global',
    typeId: 'expense',
  },
  {
    name: 'Family',
    icon: 'users',
    isActive: true,
    scope: 'global',
    typeId: 'expense',
  },
  {
    name: 'Travel',
    icon: 'plane',
    isActive: true,
    scope: 'global',
    typeId: 'expense',
  },
  {
    name: 'Debt',
    icon: 'hand-coins',
    isActive: true,
    scope: 'global',
    typeId: 'expense',
  },
  {
    name: 'Loan',
    icon: 'banknote',
    isActive: true,
    scope: 'global',
    typeId: 'expense',
  },
  {
    name: 'Savings',
    icon: 'piggy-bank',
    isActive: true,
    scope: 'global',
    typeId: 'expense',
  },
  {
    name: 'Credit Card',
    icon: 'credit-card',
    isActive: true,
    scope: 'global',
    typeId: 'expense',
  },
];

async function seedCategories() {
  try {
    // Connect to MongoDB
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error('DATABASE_URL environment variable is not set');
    }

    await mongoose.connect(databaseUrl);
    console.log('Connected to MongoDB');

    let upserted = 0;
    let inserted = 0;

    // Fetch type ObjectIds once
    const incomeType = await TypeModel.findOne({ name: 'Income' });
    const expenseType = await TypeModel.findOne({ name: 'Expense' });

    if (!incomeType || !expenseType) {
      throw new Error(
        'Income or Expense type not found in database. Please seed types first.',
      );
    }

    const typeMap = {
      income: incomeType._id,
      expense: expenseType._id,
    };

    for (const seedDoc of SEED_DATA) {
      // First try to find with scope = 'global'
      let existingDoc = await CategoryModel.findOne({
        name: seedDoc.name,
        scope: 'global',
      });

      // If not found, try to find the record that has no scope defined
      if (!existingDoc) {
        existingDoc = await CategoryModel.findOne({
          name: seedDoc.name,
          scope: { $exists: false },
        });
      }

      if (existingDoc) {
        // Update existing document
        const { typeId, ...seedDataWithoutTypeId } = seedDoc;
        const updateData = {
          ...seedDataWithoutTypeId,
          type: typeMap[typeId],
          id: serializeText(seedDoc.name),
        };

        // Handle `active` -> `isActive` migration
        const seedDocAsRecord = seedDoc as unknown as Record<string, unknown>;
        if (seedDocAsRecord['active'] !== undefined) {
          updateData.isActive = seedDocAsRecord['active'] as boolean;
          delete seedDocAsRecord['active'];
        }

        await CategoryModel.findByIdAndUpdate(
          existingDoc._id,
          { $set: updateData },
          { new: true },
        );

        console.log(`✓ Updated category: ${seedDoc.name}`);
        upserted++;
      } else {
        // Insert new document
        const { typeId, ...seedDataWithoutTypeId } = seedDoc;
        await CategoryModel.create({
          ...seedDataWithoutTypeId,
          type: typeMap[typeId],
          id: serializeText(seedDoc.name),
        });
        console.log(`✓ Inserted category: ${seedDoc.name}`);
        inserted++;
      }
    }

    console.log(
      `\nSeed completed! Inserted: ${inserted}, Updated: ${upserted}`,
    );
  } catch (error) {
    console.error('Error seeding categories:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seedCategories();
