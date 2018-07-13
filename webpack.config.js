const path = require('path');

const PROD = process.env.NODE_ENV === 'production';
const CDN = process.env.BUILD_TARGET === 'cdn';

module.exports = {
  context: path.resolve(__dirname, 'src'),
  devtool: PROD ? 'source-map' : 'inline-source-map',
  entry: './index.js',
  mode: PROD ? 'production' : 'development',
  output: {
    filename: 'press.js',
    path: CDN ? path.resolve(__dirname) : path.resolve(__dirname, 'dist')
  }
};
