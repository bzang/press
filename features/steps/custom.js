const _ = require('lodash');
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

Given(/^This scenario (prohibits|requires) JavaScript$/, (mode) => {
  if (mode === 'requires' && global.capabilities.nojs) {
    return 'skipped';
  }

  if (mode === 'prohibits' && !global.capabilities.nojs) {
    return 'skipped';
  }
});

Then(
  /^I expect the server received a form parameter named "(.+)" with a value (?:of "(.+)"|matching \/(.+)\/)$/,
  (name, value, pattern) => {
    console.log({name, value, pattern});
    const req = JSON.parse(
      browser
        .elements('#last-req')
        .getText()
        .trim()
    );
    assert.nestedProperty(req.body, name);
    if (value) {
      assert.nestedPropertyVal(req.body, name, value);
    } else {
      assert.match(_.get(req.body, name), new RegExp(pattern));
    }
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

When(
  /^I select day "(\d+)" of the month "(.+?)" of the year "(\d\d\d\d)"(?: and day "(\d+)" of the month "(.+?)" of the year "(\d\d\d\d)")?$/,
  async (
    startDayString,
    startMonthString,
    startYearString,
    endDayString,
    endMonthString,
    endYearString
  ) => {
    const [selectedMonthString, selectedYearString] = browser
      .element('.drp-calendar.left .month')
      .getText()
      .split(' ');

    console.log('selected strings', selectedMonthString, selectedYearString);

    const selectedMoment = stringsToMoment(
      selectedYearString,
      selectedMonthString,
      '1'
    );

    console.log('selectedMoment', selectedMoment.toISOString());
    const startMoment = stringsToMoment(
      startYearString,
      startMonthString,
      startDayString
    );
    console.log('startMoment', startMoment.toISOString());

    const clicksToStartMonth = computeClicks(selectedMoment, startMoment);
    increaseMonth(clicksToStartMonth);
    clickDay(startDayString);

    if (endDayString && endMonthString && endYearString) {
      const endMoment = stringsToMoment(
        endYearString,
        endMonthString,
        endDayString
      );
      console.log('endMoment', endMoment.toISOString());

      const clicksToEndMonth = computeClicks(startMoment, endMoment);
      increaseMonth(clicksToEndMonth);
      clickDay(endDayString);
    }
  }
);

When(/^I select day "(\d+)" of the next month$/, async (dayString) => {
  $('.daterangepicker .next').click();
  clickDay(dayString);
});

function computeClicks(current, target) {
  const yearClicks = 12 * (target.year() - current.year());
  const monthClicks = target.month() - current.month();
  if (target.month() < current.month() && !yearClicks) {
    throw new Error(
      'We have not written the tooling to decrease the selected month, please only choose dates increasingly far in the future'
    );
  }
  return yearClicks + monthClicks;
}

function stringsToMoment(year, month, date) {
  return moment()
    .year(year)
    .month(month)
    .date(date);
}

function increaseMonth(count) {
  for (let i = 0; i < count; i++) {
    // we need to reselect the element after each click; otherwise, it seems
    // to become a different node sometimes
    $('.daterangepicker .next').click();
  }
}

function clickDay(dayString) {
  const xpath = `.//td[text() = '${dayString}']`;
  const {value: elements} = browser.element('.calendar-table').elements(xpath);

  if (elements.length === 0) {
    throw new Error(`Could not locate element with XPath ${xpath}`);
  }

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
