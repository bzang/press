const path = require('path');
const util = require('util');

const _ = require('lodash');
const bodyParser = require('body-parser');
const errorHandler = require('errorhandler');
const express = require('express');
const morgan = require('morgan');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));

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
  next();
});

app.use('*', (req, res) => {
  const view = req.path === '/' ? 'index' : req.path;

  res.render(path.join('pages', view));
});

app.use(errorHandler());

if (require.main === module) {
  const listener = app.listen(process.env.PORT, () => {
    console.log(`Your app is listening on port ${listener.address().port}`);
  });
} else {
  module.exports = {app};
}
