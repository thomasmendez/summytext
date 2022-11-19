const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: path.join(__dirname, 'src', 'index.js'),
  output: {
    path: path.join(__dirname, 'dist'),
  },
  devServer: {
    port: 8080,
    hot: true,
    open: true,
    watchFiles: ['src/**/*.js', 'src/**/*.jsx'],
    devMiddleware: {
      writeToDisk: true,
    },
    client: {
      overlay: {
        errors: false,
        warnings: false,
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.(jsx|js)$/,
        exclude: '/node_modules/',
        use: ['babel-loader', 'eslint-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'public', 'index.html'),
    }),
    new ESLintPlugin({
      cache: true,
      eslintPath: require.resolve('eslint'),
      resolvePluginsRelativeTo: __dirname,
      ignore: true,
      useEslintrc: true,
      extensions: ['.js', '.jsx'],
      exclude: 'node_modules',
      fix: true,
      emitError: true,
      failOnError: false,
      emitWarning: true,
      failOnWarning: false,
    }),
  ],
};
