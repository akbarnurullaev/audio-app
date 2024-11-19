module.exports = {
  root: true,
  extends: '@react-native',
  plugins: ['unused-imports'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'indent': ['error', 2],
    'unused-imports/no-unused-imports': 'error',
  },
};
