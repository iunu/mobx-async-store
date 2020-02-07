module.exports = {
  "parser": "babel-eslint",
  "extends": [
    "standard",
    "plugin:react/recommended"
  ],
  "rules": {
    "camelcase": 0,
    "indent": 0,
    "quote-props": [2, "consistent-as-needed"]
  },
  "env": {
    "jest": true
  }
};
