module.exports = {
  parser: '@babel/eslint-parser',
  extends: [
    'standard',
    'plugin:react/recommended'
  ],
  rules: {
    'camelcase': 0,
    'indent': 0,
    'quote-props': [2, 'consistent-as-needed']
  },
  env: {
    jest: true
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
}
