/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'], // Matches test files
  moduleFileExtensions: ['ts', 'js', 'json'],
  verbose: true,
  collectCoverage: true, // Optional: Collect test coverage
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
};
