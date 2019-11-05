module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.js?$': 'ts-jest',
  },
  coveragePathIgnorePatterns: [
    './test/test-utils/',
  ],
  coverageThreshold: {
    global: {
      statements: 99,
      branches: 99,
      functions: 100,
      lines: 100,
    },
  },
};
