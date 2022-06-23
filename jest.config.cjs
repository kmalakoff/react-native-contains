module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['<rootDir>/test/setup-jest.cjs'],
  testEnvironment: 'node',
  clearMocks: true,
  testMatch: ['**/?(*.)test.(j|t|cj|mj)s?(x)'],
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  transform: {},
  coverageReporters: ['text', 'json'],
};
