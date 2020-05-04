module.exports = {
  "parser": "babel-eslint",
  "extends": [
    "standard",
    "plugin:react/recommended"
  ],
  "rules": {
    "camelcase": 0,
    "curly": 0,
    "comma-dangle": 0,
    "indent": 0,
    "quote-props": [2, "consistent-as-needed"],
    "space-before-function-paren": 0
  },
  "env": {
    "jest": true
  }
};
