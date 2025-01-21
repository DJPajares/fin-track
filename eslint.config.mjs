import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat({
  // import.meta.dirname is available after Node.js v20.11.0
  baseDirectory: import.meta.dirname,
  recommendedConfig: js.configs.recommended
});

const eslintConfig = [
  {
    ignores: [
      './node_modules/*', // Node modules at the root level
      './out/*', // Output directories
      './.next/*', // Next.js build files
      './coverage/*', // Coverage reports
      '**/dist/*', // Build artifacts for all packages
      '**/build/*', // Build artifacts for all packages
      '**/node_modules/*', // Node modules for each package
      '**/out/*', // Output directories for each package
      '**/.next/*', // Next.js build files for each package
      '**/.turbo/*' // TurboRepo cache files
    ]
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
      semi: ['warn', 'always'], // Enforce semicolons
      quotes: ['error', 'single'],
      'no-duplicate-imports': ['error']
    }
  }
];

export default eslintConfig;
