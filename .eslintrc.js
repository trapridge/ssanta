module.exports = {
  "env": {
    "node": true,
    "commonjs": true,
    "es6": true
  },
  "extends": "eslint:recommended",
  "installedESLint": true,
  "parserOptions": {
    "ecmaFeatures": {
      "experimentalObjectRestSpread": true,
      // "jsx": true
    },
    "sourceType": "module"
  },
  // "plugins": [
  //   "react"
  // ],
  "rules": {
    "indent": [
      "error", 2
    ],
    "linebreak-style": [
      "error",
      "unix"
    ],
    "quotes": [
      "error",
      "single"
    ],
    "semi": [
      "error",
      "never"
    ],
    "no-unused-vars": 0,
    "no-console": 0,
    // "no-process-env": 0
  }
};