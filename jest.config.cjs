module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['<rootDir>/test/setup-jest.cjs'],
  testEnvironment: 'node',
  clearMocks: true,
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  coverageReporters: ['text', 'json'],
};
