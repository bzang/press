'use strict';

// We have both a `.babelrc` and `.babelrc.js`. `.babelrc.js` is a babel preset
// loaded by the `.babelrc`. By exposing our config as a preset, we get to use
// the full power of JavaScript to customize the build process. Babel 7, when it
// has a stable release, will support JavaScript config files natively.

const fs = require('fs');

const PROD = process.env.NODE_ENV === 'production';
const CJS = process.env.BUILD_TARGET === 'cjs';

module.exports = {
  plugins: ['lodash', 'transform-runtime'],
  presets: [
    [
      'env',
      {
        // unless we're explicitly building for cjs, assume we want modules.
        // (webpack treeshakes better with modules)
        modules: CJS ? 'commonjs' : false,
        targets: {
          // babel-preset-env for babel 6 doesn't seem to load
          // `.browserlsistrc` automatically. It will in Babel 7.
          browsers: fs.readFileSync('./.browserslistrc', 'utf-8').split('\n')
        },
        useBuiltIns: 'entry',
        uglify: false
      }
    ],
    PROD && 'minify'
  ].filter(Boolean)
};
