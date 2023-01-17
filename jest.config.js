/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  verbose: true,
  moduleFileExtensions: ['js', 'ts'],
  extensionsToTreatAsEsm: ['.ts'],
  transform: {
    '.js': ['jest-esbuild', {
      format: 'esm',
      loader: 'js'
    }],
    '.ts': ['jest-esbuild', {
      format: 'esm',
      loader: 'ts'
    }]
  },
  resolver: 'jest-ts-webcompat-resolver',
  testEnvironment: 'node',
  testMatch: [
    '**/tests/*.spec.ts'
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    '**/src/react.{js,ts}',
    '!**/node_modules/**'
  ],
  coverageProvider: 'v8',
  coverageReporters: ['text']
};

module.exports = config;
