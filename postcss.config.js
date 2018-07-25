module.exports = function({
  env,
  file,
  options: {autoprefixer = {}, cssnano = {}}
}) {
  return {
    plugins: {
      'postcss-import': {root: file.dirname},
      autoprefixer: env === 'production' ? autoprefixer : false,
      cssnano: env === 'production' ? cssnano : false
    }
  };
};
