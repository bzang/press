const {Given, Then, When} = require('cucumber');
const {assert} = require('chai');
const moment = require('moment');
const openWebsite = require('../support/action/openWebsite');

const checkTitle = require('../support/check/checkTitle');

Given(
  /^I open the (url|site) "([^"]*)?" with inputfield "(.+)" set to "(.+)"$/,
  (type, page, name, value) => {
    page += `?${name}=${value}`;
    openWebsite(type, page);
  }
);

Given('This scenario requires JavaScript', () => {
  // @ts-ignore
  if (global.capabilities.nojs) {
    return 'skipped';
  }
});

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
    // @ts-ignore
    const title = global.capabilities.nojs
      ? 'JavaScript is not supported'
      : 'JavaScript is supported';
    checkTitle(false, title);
  }
);

When(
  /I select day "(\d+)" of the month "(.+?)" of the year "(\d\d\d\d)"/,
  async (dayString, monthString, yearString) => {
    const target = moment()
      .year(yearString)
      .month(monthString)
      .date(dayString);
    const now = moment();

    const clicksToJanuary = 12 - now.month();
    const clicksToTargetMonth = target.month();
    const clicksToTargetYear = 12 * (target.year() - now.year() - 1);
    const clicks = clicksToJanuary + clicksToTargetMonth + clicksToTargetYear;

    for (let i = 0; i < clicks; i++) {
      // we need to reselect the element after each click; otherwise, it seems
      // to become a different node sometimes
      $('.daterangepicker .next').click();
    }

    const {value: elements} = browser
      .element('.calendar-table')
      .elements(`.//td[text() ='${dayString}']`);

    if (elements.length > 1) {
      const el = elements.find(({ELEMENT}) => {
        const classes = browser.elementIdAttribute(ELEMENT, 'class');
        if (!classes.value) {
          return;
        }
        return !classes.value.includes('off');
      });

      browser.elementIdClick(el.ELEMENT);
    } else {
      browser.elementIdClick(elements[0].ELEMENT);
    }
  }
);
