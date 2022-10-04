/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom', // 'node'
  automock: false,
  coverageReporters: [
    'json-summary',
    'text',
    'lcov'
  ],
  setupFiles: [
    './setupJest.js'
  ],
  transform: {
    '^.+\\.js?$': 'babel-jest',
    '^.+.tsx?$': [
      {
        tsconfig: 'tsconfig.spec.js',
        isolatedModules: true
      }
    ]
  },
  testPathIgnorePatterns: [
    '/tests/fixtures/',
    '/tests/support/',
    '/dist/',
    '/node_modules/',
    '/rollup.config.js',
    '/setupJest.js'
  ],
  moduleNameMapper: {
    // https://github.com/uuidjs/uuid/pull/616#issuecomment-1111006686
    '^uuid$': require.resolve('uuid')
  }
}
