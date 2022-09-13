// craco.config.js
const webpack = require('webpack');
const webpackResolve = require('craco-webpack-resolve');

module.exports = {
  plugins: [
    {
      plugin: webpackResolve,
      options: {
        resolve: {
          fallback: {
            crypto: require.resolve('crypto-browserify'),
            stream: require.resolve('stream-browserify'),
            http: require.resolve('stream-http'),
            https: require.resolve('https-browserify'),
            os: require.resolve('os-browserify/browser'),
            url: require.resolve('url/'),
            assert: require.resolve('assert/'),
            buffer: require.resolve('buffer'),
          },
        },
      },
    },
  ],
  webpack: {
    plugins: [
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
        process: 'process/browser',
      }),
    ],
    ignoreWarnings: [/Failed to parse source map/],
  },
};
