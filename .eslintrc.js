module.exports = {
  extends: ['airbnb-base', 'plugin:jest/recommended'],
  env: {
    'jest/globals': true,
  },
  plugins: ['jest'],
  rules: {
    'max-len': ['error', { code: 100, ignoreComments: true, ignoreTemplateLiterals: true }],
    'func-names': ['off'],
    'arrow-parens': ['error', 'as-needed', { requireForBlockBody: true }],
  },
};
