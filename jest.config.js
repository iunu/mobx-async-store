const config = {
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
        '^.+\\.js?$': 'babel-jest'
    },
    testPathIgnorePatterns: [
        '/tests/fixtures/',
        '/tests/support/',
        '/dist/',
        '/node_modules/',
        '/rollup.config.js',
        '/setupJest.js'
    ],
    testEnvironment: 'jsdom',
    moduleNameMapper: {
      // https://github.com/uuidjs/uuid/pull/616#issuecomment-1111006686
      '^uuid$': require.resolve('uuid'),
    },
  }
  
  module.exports = config