const path = require('path');
const util = require('util');

const _ = require('lodash');
const bodyParser = require('body-parser');
const errorHandler = require('errorhandler');
const express = require('express');
const morgan = require('morgan');
const webpack = require('webpack');
const middleware = require('webpack-dev-middleware');

const config = require('../../webpack.config');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));

const compiler = webpack(config);
app.use(middleware(compiler));

app.use(express.static(path.resolve(__dirname, '../../src')));

// Add helpers that'll be available to all templates
app.use((req, res, next) => {
  res.locals = res.locals || {};
  res.locals.util = util;
  res.locals.req = JSON.stringify(
    _.pick(
      req,
      'body',
      'cookies',
      'headers',
      'path',
      'params',
      'method',
      'query'
    ),
    null,
    2
  );
  res.locals.value = (name) => {
    if (_.has(req, `query.${name}`)) {
      return `value="${_.get(req, `query.${name}`)}"`;
    }
    return '';
  };
  next();
});

function renderView(req, res) {
  const view = req.path === '/' ? 'index' : req.path;
  const viewPath = path.join('pages', view);

  res.render(viewPath);
}
// app.use puts the path in req.params whereas app[VERB] puts it in req.path,
// hence the discrete `get` and `post` calling the same function here.
app.get('*', renderView);
app.post('*', renderView);

app.use(errorHandler());

if (require.main === module) {
  const listener = app.listen(process.env.PORT, () => {
    console.log(`Your app is listening on port ${listener.address().port}`);
  });
} else {
  module.exports = {app};
}
