import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import reactHooks from 'eslint-plugin-react-hooks';

const compat = new FlatCompat({
  // import.meta.dirname is available after Node.js v20.11.0
  baseDirectory: import.meta.dirname,
  recommendedConfig: js.configs.recommended,
});

const eslintConfig = [
  {
    ignores: [
      './node_modules/*',
      '**/node_modules/*',
      '**/.next/*',
      '**/dist/*',
      '**/build/*',
      '**/out/*',
      '**/public/*',
    ],
  },
  // Use FlatCompat to bring in legacy shareable configs cleanly
  ...compat.extends(
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/strict',
    'prettier',
  ),
  {
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: {
      'no-underscore-dangle': [
        'error',
        {
          allow: [
            '_id', // MongoDB's default ID field.
          ],
        },
      ],
      'no-use-before-define': 'off',
      'no-duplicate-imports': ['error'],
      // React Hooks best practices
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      // TypeScript specific rules to catch type errors
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-non-null-assertion': 'warn',
    },
  },
  {
    settings: {
      next: {
        rootDir: 'packages/web/',
      },
    },
  },
];

export default eslintConfig;
