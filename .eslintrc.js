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
  },
  settings: {
    'import/extensions': ['.js','.ts'],
    'import/parsers': {
      '@typescript-eslint/parser': ['.js','.ts'],
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.ts'],
      },
    },
  },
  root: true,
};
