const path = require('path');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

const PROD = process.env.NODE_ENV === 'production';
const CDN = process.env.BUILD_TARGET === 'cdn';
const MODULE = process.env.BUILD_TARGET === 'esm';

module.exports = {
  context: path.resolve(__dirname, 'src'),
  devtool: PROD ? 'source-map' : 'inline-source-map',
  entry: './index.js',
  mode: PROD ? 'production' : 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  resolve: {
    alias: {
      // By default, the version of Vue published to npm does not include the
      // template compiler; this alias overrides that.
      vue: 'vue/dist/vue.esm.js'
    }
  },
  output: {
    filename: PROD ? 'press.min.js' : 'press.js',
    path: CDN ? path.resolve(__dirname) : path.resolve(__dirname, 'dist')
  },
  plugins: [new LodashModuleReplacementPlugin()]
};

if (CDN) {
  module.exports.externals = module.exports.externals || {};
  Object.assign(module.exports.externals, {
    vue: 'Vue',
    'vee-validate': 'VeeValidate'
  });
}

if (MODULE) {
  module.exports.target = 'node';
}
