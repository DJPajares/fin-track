import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

export default defineConfig([
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 'latest',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^node:'], // node builtins
            ['^@?\\w'], // external packages
            ['^@split-snap'], // internal monorepo
            ['^\\.'], // relative imports
          ],
        },
      ],
      'simple-import-sort/exports': 'error',
    },
  },
  globalIgnores(['dist/**', 'node_modules/**']),
]);
