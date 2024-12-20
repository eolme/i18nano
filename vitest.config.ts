import { defineConfig } from 'vitest/config';

export default defineConfig({
  appType: 'custom',
  test: {
    include: [
      './tests/*.spec.ts'
    ],
    environment: 'node',
    coverage: {
      enabled: true,
      reporter: 'text',
      exclude: [
        // Exclude tests and test utils
        '**/tests/**/*',

        // Too complex polyfills for coverage
        '**/src/react.ts',

        '**/vite.config.ts',
        '**/vitest.config.ts',

        '**/examples/**/*',

        '**/lib/**/*'
      ]
    }
  },
  resolve: {
    alias: {
      react: 'react'
    }
  }
});
