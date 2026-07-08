const { createCjsPreset } = require('jest-preset-angular/presets');

/** @type {import('jest').Config} */
module.exports = {
  ...createCjsPreset({
    tsconfig: '<rootDir>/tsconfig.jest.json',
  }),
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  // Jest solo corre los tests *.jest.spec.ts; el resto (*.spec.ts) los corre Karma + Jasmine.
  testMatch: ['<rootDir>/src/**/*.jest.spec.ts'],
  coverageDirectory: '<rootDir>/coverage/jest',
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.spec.ts',
    '!src/**/*.jest.spec.ts',
    '!src/**/*.model.ts',
    '!src/**/*.models.ts',
    '!src/main.ts',
    '!src/**/*.routes.ts',
    '!src/**/*.config.ts',
    '!src/environments/**',
  ],
};
