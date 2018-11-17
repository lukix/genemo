module.exports = {
  coveragePathIgnorePatterns: [
    './test/test-utils/',
  ],
  coverageThreshold: {
    global: {
      statements: 99,
      branches: 90,
      functions: 100,
      lines: 99,
    },
  },
};
