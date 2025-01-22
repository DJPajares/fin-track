import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

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
  ...compat.extends(
    'eslint:recommended',
    'eslint-config-next',
    'eslint-config-prettier',
    'next/core-web-vitals',
    'prettier',
    'next',
    'plugin:@next/next/recommended',
    'plugin:@typescript-eslint/eslint-plugin/recommended',
  ),
  {
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/no-unescaped-entities': 'off',
      'no-underscore-dangle': [
        'error',
        {
          allow: [
            '_id', // MongoDB's default ID field.
          ],
        },
      ],
      'import/extensions': [
        'error',
        'ignorePackages',
        {
          js: 'never',
          jsx: 'never',
          ts: 'never',
          tsx: 'never',
        },
      ],
      'import/no-unresolved': [2, { caseSensitive: false }],
      'no-use-before-define': 'off',
      'react/jsx-filename-extension': [1, { extensions: ['.jsx', '.tsx'] }],
      'no-duplicate-imports': ['error'],
    },
  },
];

export default eslintConfig;
