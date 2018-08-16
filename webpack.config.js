const path = require('path');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {EnvironmentPlugin} = require('webpack');

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
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.css$/,
        use: [
          PROD
            ? MiniCssExtractPlugin.loader
            : {loader: 'vue-style-loader', options: {sourceMap: true}},
          {loader: 'css-loader', options: {importLoaders: 1, sourceMap: true}},
          {loader: 'postcss-loader', options: {sourceMap: true}}
        ]
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
  // paths:true is needed for get/has/set deep path support which is pretty much
  // the whole reason we're loading lodash in the first place
  plugins: [
    new EnvironmentPlugin({
      AUTORUN: false,
      BUILD_TARGET: ''
    }),
    new LodashModuleReplacementPlugin({paths: true}),
    PROD &&
      new MiniCssExtractPlugin({
        filename: 'press.css',
        chunkFilename: '[id].css'
      }),
    new VueLoaderPlugin()
  ].filter(Boolean)
};

if (CDN) {
  module.exports.externals = module.exports.externals || {};
  Object.assign(module.exports.externals, {
    jquery: '$',
    vue: 'Vue'
  });
}

if (MODULE) {
  module.exports.target = 'node';
}
