module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['airbnb-base', 'plugin:jest/recommended'],
  env: {
    'jest/globals': true,
  },
  plugins: ['jest', '@typescript-eslint'],
  rules: {
    'max-len': ['error', { code: 100, ignoreComments: true, ignoreTemplateLiterals: true }],
    'func-names': ['off'],
    'arrow-parens': ['off'],
    'import/prefer-default-export': 0,
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.ts'],
      },
    },
  },
};
