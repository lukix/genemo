module.exports = {
  coveragePathIgnorePatterns: ['./test/test-utils/'],
  coverageThreshold: {
    global: {
      branches: 72,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
};
