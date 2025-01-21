import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat({
  // import.meta.dirname is available after Node.js v20.11.0
  baseDirectory: import.meta.dirname,
  recommendedConfig: js.configs.recommended
});

const eslintConfig = [
  {
    ignores: ['./node_modules/*', './out/*', './.next/*', './coverage']
  },
  ...compat.extends(
    'eslint:recommended',
    'eslint-config-next',
    'next/core-web-vitals',
    'prettier',
    'next'
  ),
  {
    rules: {
      'react/no-unescaped-entities': 'off',
      '@next/next/no-page-custom-font': 'off',
      semi: ['error', 'always'], // Enforce semicolons
      quotes: ['error', 'single'],
      'no-duplicate-imports': ['error']
    }
  }
];

export default eslintConfig;
