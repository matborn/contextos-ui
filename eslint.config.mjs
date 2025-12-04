import nextConfig from 'eslint-config-next';
import storybook from 'eslint-plugin-storybook';

export default [
  {
    ignores: ['node_modules/**', '.next/**', 'dist/**', 'storybook-static/**'],
  },
  ...nextConfig,
  ...storybook.configs['flat/recommended'],
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: ['./tsconfig.json'],
      },
    },
  },
  {
    files: ['components/ui/Avatar.tsx'],
    rules: {
      '@next/next/no-img-element': 'off',
    },
  },
];
