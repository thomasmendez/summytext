module.exports = {
  parser: 'babel-eslint',
  env: {
    browser: true,
    node: true,
    es2021: true,
    jest: true,
  },
  plugins: [
    'react',
  ],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:react-hooks/recommended',
    'plugin:import/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  ignorePatterns: ['./dist'],
  rules: {
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'react/jsx-no-useless-fragment': ['error'],
    'react/jsx-one-expression-per-line': ['error'],
    'react/jsx-child-element-spacing': 'error',
    'react/jsx-indent': [2, 2, { 'checkAttributes': true, 'indentLogicalExpressions': true }],
    'react/jsx-closing-bracket-location': [1, 'tag-aligned'],
    'react/jsx-indent-props': [2, 2],
    'react/self-closing-comp': ['error'],
    'no-unused-vars': 1,
    'no-tabs': ['error', { 'allowIndentationTabs': true }],
    'linebreak-style': ['error', 'unix'],
    'quotes': ['error', 'single'],
    'comma-dangle': ['error', 'always-multiline'],
    'no-multiple-empty-lines': ['error', { 'max': 2, 'maxEOF': 0 }],
    'no-console': process.env.NODE_ENV === 'production' ? 2 : ['error', { 'allow': ['warn', 'error', 'info', 'debug'] }],
    'eqeqeq': ['error', 'smart'],
    'semi': [2, 'always'],
    'no-restricted-imports': [
      'error',
      {
        'patterns': ['@mui/*/*/*', '!@mui/material/test-utils/*'],
      },
    ],
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      webpack: {
        config: {
          resolve: {
            extensions: ['.js', '.jsx'],
          },
        },
      },
    },
  },
};
