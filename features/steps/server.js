const {Then} = require('cucumber');
const {assert} = require('chai');
const checkTitle = require('../support/check/checkTitle');

Then(
  /I expect the server received a form parameter named "(.+)" with a value of "(.+)"/,
  (name, value) => {
    const req = JSON.parse(
      browser
        .elements('#last-req')
        .getText()
        .trim()
    );
    assert.nestedProperty(req.body, name);
    assert.nestedPropertyVal(req.body, name, value);
  }
);

Then(
  'I expect that the title indicates if this browser supports JavaScript',
  () => {
    const title = global.capabilities.nojs
      ? 'JavaScript is not supported'
      : 'JavaScript is supported';
    checkTitle(false, title);
  }
);
