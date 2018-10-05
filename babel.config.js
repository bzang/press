const CJS = process.env.BUILD_TARGET === 'cjs';

module.exports = {
  plugins: [
    'lodash',
    [
      '@babel/plugin-transform-runtime',
      {
        corejs: 2
      }
    ]
  ],
  presets: [
    [
      '@babel/preset-env',
      {
        // unless we're explicitly building for cjs, assume we want modules.
        // (webpack treeshakes better with modules)
        modules: CJS ? 'commonjs' : false,
        useBuiltIns: 'usage'
      }
    ]
  ].filter(Boolean),
  sourceMaps: true
};
