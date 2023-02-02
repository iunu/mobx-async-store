module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:import/typescript',
    'plugin:jsdoc/recommended'
  ],
  rules: {
    'camelcase': 0,
    'indent': 0,
    'quote-props': [2, 'consistent-as-needed'],
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
    // '@typescript-eslint/explicit-function-return-type': 'warn',
    // '@typescript-eslint/no-explicit-any': 'error'
  },
  plugins: [
    '@typescript-eslint',
    '@babel',
    'import',
    'prettier'
  ],
  env: {
    jest: true,
    node: true,
    es6: true,
    browser: true
  },
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.json'
      }
    }
  }
}
