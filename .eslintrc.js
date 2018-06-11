module.exports = {
  root: true,
  parser: 'babel-eslint',
  env: {
    browser: true,
    node: true,
  },
  extends: 'standard',
  // required to lint *.vue files
  plugins: [
    'html',
    'mocha'
  ],
  // add your custom rules here
  rules: {
    "mocha/no-exclusive-tests": "error",
    'space-before-function-paren': [
      2,
      {
        anonymous: 'always',
        named: 'never'
      }
    ],
  },
  globals: {}
}
