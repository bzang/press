const path = require('path');
const util = require('util');

const _ = require('lodash');
const bodyParser = require('body-parser');
const errorHandler = require('errorhandler');
const express = require('express');
const morgan = require('morgan');
const webpack = require('webpack');
const middleware = require('webpack-dev-middleware');
const glob = require('glob');

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

  res.locals.pages = glob
    .sync('**/*.ejs', {cwd: path.resolve(__dirname, 'views', 'pages')})
    .filter((filename) => filename !== 'index.ejs')
    .map((filename) => filename.replace('.ejs', ''));

  res.locals.valueObject = (names) => {
    const obj = names.reduce((acc, name) => {
      acc[name] = _.get(req, `query.${name}`);
      return acc;
    }, {});
    return `value='${JSON.stringify(obj) || ''}'`;
  };

  res.locals.value = (name) => {
    if (_.has(req, `query.${name}`)) {
      return `value="${_.get(req, `query.${name}`)}"`;
    }
    return '';
  };
  next();
});

// this is a *really* silly endpoint that just returns strings of the letter
// "a", depending on how many "a"s are sent.
app.get('/autocomplete', (req, res, next) => {
  if (req.accepts('html')) {
    next();
    return;
  }

  if (req.accepts('json')) {
    if (!req.query.q || !req.query.q.length || !/^a+$/.test(req.query.q)) {
      res.status(200).json([]);
      return;
    }

    res
      .status(200)
      .send(
        [
          {label: 'a'},
          {label: 'aa'},
          {label: 'aaa'},
          {label: 'aaaa'},
          {label: 'aaaaa'}
        ].slice(req.query.q.length - 1)
      );
    return;
  }

  res.status(406).send('This endpoint can only return HTML and JSON responses');
});

/**
 * Renders a view according the the request path.
 * @param {express.Request} req
 * @param {express.Response} res
 */
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

// @ts-ignore - this will *not* always return false, but ts changed something
if (require.main === module) {
  app.listen(process.env.PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Your app is listening on port ${process.env.PORT}`);
  });
} else {
  module.exports = {app};
}
