module.exports = {
  extends: ['react-app', 'eslint:recommended'],
  parserOptions: {
    ecmaVersion: 2018,
  },
  env: {
    node: true,
    es6: true,
  },
  overrides: [
    {
      files: ['**/src/**'],
      parserOptions: {
        sourceType: 'module',
      },
    },
  ],
};
