const path = require('path');

const bodyParser = require('body-parser');
const errorHandler = require('errorhandler');
const express = require('express');
const morgan = require('morgan');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/client.js', (req, res) => {
  res.sendfile(path.resolve(__dirname, '../../../press.js'));
});
app.get('/press.js', (req, res) => {
  res.sendfile(path.resolve(__dirname, '../../../press.js'));
});
app.use(express.static(path.resolve(__dirname, 'public')));

function validate(body) {
  const validationErrors = {};
  if (body) {
    if (!body.name) {
      validationErrors.name = 'Name is required';
    } else if (!/^[A-Z]/.test(body.name)) {
      validationErrors.name = 'Name must begin with a capital letter';
    }

    if (!body.start_date) {
      validationErrors.start_date = 'Start Date is required';
    } else if (Number.isNaN(Date.parse(body.start_date))) {
      validationErrors.start_date = 'Start Date must be a Date';
    }

    if (body.email && !/.+@.+\..+/.test(body.email)) {
      validationErrors.email = 'Email Address must contain an @ sign';
    }

    if (!body.end_date) {
      validationErrors.end_date = 'End Date is required';
    } else if (Number.isNaN(Date.parse(body.end_date))) {
      validationErrors.end_date = 'End Date must be a Date';
    }

    if (body.end_date < body.start_date) {
      validationErrors.end_date = 'End Date must be after Start Date';
    }
  }
  return validationErrors;
}

app.post('/datepicker', (req, res) => {
  console.log(req.body);
  const validationErrors = {};
  if (!req.body.start_date) {
    validationErrors.start_date = 'start_date is required';
  }

  if (!req.body.end_date) {
    validationErrors.end_date = 'end_date is required';
  }

  if (req.body.start_date >= req.body.end_date) {
    validationErrors.end_date = 'end_date must be greater than start_date';
  }

  res.render('pages/datepicker', {
    body: req.body,
    validationErrors
  });
});

app.get('*', (req, res) => {
  const body = (Object.keys(req.query).length && req.query) || undefined;
  const view = req.path === '/' ? 'index' : req.path;

  res.locals = {
    util: require('util')
  };

  res.render(path.join('pages', view), {
    body,
    validationErrors: (body && validate(body)) || {}
  });
});

app.use(errorHandler());

if (require.main === module) {
  const listener = app.listen(process.env.PORT, () => {
    console.log(`Your app is listening on port ${listener.address().port}`);
  });
} else {
  module.exports = app;
}
