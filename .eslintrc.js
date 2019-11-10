const supportedExtensions = ['.js','.ts'];
module.exports = {
  extends: [
    'airbnb-base',
    'plugin:jest/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  plugins: ['jest', '@typescript-eslint'],
  parser: '@typescript-eslint/parser',
  env: {
    'jest/globals': true,
  },
  rules: {
    'max-len': ['error', { code: 100, ignoreComments: true, ignoreTemplateLiterals: true }],
    'func-names': ['off'],
    'arrow-parens': ['off'],
    'import/prefer-default-export': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/ban-ts-ignore': 0,
    '@typescript-eslint/no-explicit-any': 0,
  },
  settings: {
    'import/extensions': supportedExtensions,
    'import/parsers': {
      '@typescript-eslint/parser': supportedExtensions,
    },
    'import/resolver': {
      node: {
        extensions: supportedExtensions,
      },
    },
  },
  root: true,
};
