module.exports = function({
  env,
  file,
  options: {autoprefixer = {}, cssnano = {}}
}) {
  return {
    plugins: {
      /* eslint-disable sort-keys */
      'postcss-import': {root: file.dirname},
      autoprefixer: env === 'production' ? autoprefixer : false,
      cssnano: env === 'production' ? cssnano : false
      /* eslint-enable sort-keys */
    }
  };
};
