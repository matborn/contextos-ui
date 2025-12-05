import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { defineConfig } from 'vitest/config';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';

const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

const safeResolve = (specifier: string) => {
  try {
    return require.resolve(specifier);
  } catch {
    return specifier;
  }
};
const storybookAliases = {
  'storybook/preview-api': safeResolve('storybook/preview-api'),
  '@storybook/preview-api': safeResolve('storybook/preview-api'),
  '@storybook/addon-a11y/preview': safeResolve('@storybook/addon-a11y/preview'),
  '@storybook/nextjs-vite': safeResolve('@storybook/nextjs-vite'),
  '@storybook/nextjs-vite/navigation.mock': path.join(dirname, '.storybook/mocks/navigation.mock.ts'),
  '@storybook/nextjs-vite/router.mock': path.join(dirname, '.storybook/mocks/router.mock.ts'),
  'next/dist/client/components/is-next-router-error': path.join(dirname, '.storybook/mocks/is-next-router-error.ts'),
};

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  resolve: {
    alias: storybookAliases,
  },
  test: {
    projects: [
      {
        test: {
          name: 'unit',
          environment: 'jsdom',
          include: ['**/*.test.ts', '**/*.test.tsx'],
          exclude: ['node_modules/**', 'dist/**', 'storybook-static/**', '.storybook/**'],
        },
      },
    ]
  }
});
