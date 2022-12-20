module.exports = {
  extends: ['plugin:jsdoc/recommended'],
  ignorePatterns: ['src/decorators', 'src/schema.js', 'src/testUtils.js', 'spec', 'src/utils.js'],
  rules: {
    'require-jsdoc': 1
  }
}
