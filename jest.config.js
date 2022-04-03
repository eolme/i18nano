/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  moduleFileExtensions: ['js', 'ts'],
  extensionsToTreatAsEsm: ['.ts'],
  transform: {
    '.ts': ['jest-esbuild', {
      format: 'esm',
      loader: 'ts'
    }]
  },
  resolver: 'jest-ts-webcompat-resolver',
  testEnvironment: 'node',
  testMatch: [
    '**/tests/*.ts'
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
