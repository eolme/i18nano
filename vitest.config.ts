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
      provider: 'c8',
      reporter: 'text'
    }
  }
});
