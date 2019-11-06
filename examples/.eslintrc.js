module.exports = {
  extends: [
    'airbnb-base',
    'plugin:jest/recommended',
  ],
  rules: {
    'max-len': ['error', { code: 100, ignoreComments: true, ignoreTemplateLiterals: true }],
    'func-names': ['off'],
    'arrow-parens': ['off'],
    'import/prefer-default-export': 0,
  },
  root: true,
};
