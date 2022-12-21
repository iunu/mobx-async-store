module.exports = {
  extends: ['plugin:jsdoc/recommended'],
  ignorePatterns: ['src/decorators', 'src/schema.js', 'src/testUtils.js', 'spec', 'src/utils.js'],
  rules: {
    'jsdoc/require-jsdoc': ['error', {
      checkGetters: 'no-setter',
      require: {
        ArrowFunctionExpression: true,
        MethodDefinition: true
      }
    }],
    'jsdoc/require-description': 'error',
    'jsdoc/require-param': 'error',
    'jsdoc/require-returns-check': 'error'
  }
}
