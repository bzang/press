const PROD = process.env.NODE_ENV === 'production';
const CJS = process.env.BUILD_TARGET === 'cjs';

module.exports = {
  plugins: ['lodash', '@babel/plugin-transform-runtime'],
  presets: [
    [
      '@babel/preset-env',
      {
        // unless we're explicitly building for cjs, assume we want modules.
        // (webpack treeshakes better with modules)
        modules: CJS ? 'commonjs' : false,
        useBuiltIns: 'entry'
      }
    ],
    PROD && 'minify'
  ].filter(Boolean)
};
