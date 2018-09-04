const _ = require('lodash');
const {Given, Then, When} = require('cucumber');
const {assert} = require('chai');
const moment = require('moment');
const checkTitle = require('../support/check/checkTitle');
const openWebsite = require('../support/action/openWebsite');
const setInputField = require('../support/action/setInputField');

const ISO_FORMAT = 'YYYY-MM-DD';
const DISPLAY_FORMAT = 'MMM D, YYYY';
const NATIVE_DISPLAY_FORMAT = 'L';

Given(
  /^I open the (url|site) "([^"]*)?" with inputfield "(.+)" set to "(.+)"$/,
  (type, page, name, value) => {
    page += `?${name}=${value}`;
    openWebsite(type, page);
  }
);

Given('This scenario is pending', () => 'pending');

Given(/^This scenario (prohibits|requires) JavaScript$/, (mode) => {
  if (mode === 'requires' && global.capabilities.nojs) {
    return 'skipped';
  }

  if (mode === 'prohibits' && !global.capabilities.nojs) {
    return 'skipped';
  }
});

Then(
  /^I expect an autocomplete popup with "(.+)" (?:entry|entries)$/,
  (count) => {
    browser.waitForVisible('.results .result');
    const elements = browser.elements('.results .result').value;
    assert.lengthOf(elements, count);
  }
);

Then(
  /^I expect the server received a form parameter named "(.+)" with a value (?:of "(.+)"|matching \/(.+)\/)$/,
  (name, value, pattern) => {
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
  /^I expect the server received an iso date named "(.+)"(?: of "(.+)", "(.+)" of next year)?$/,
  (name, month, date) => {
    const req = JSON.parse(
      browser
        .elements('#last-req')
        .getText()
        .trim()
    );
    assert.nestedProperty(req.body, name);

    if (month && date) {
      const targetDate = momentFromMonthDateNextYear(month, date);
      assert.nestedPropertyVal(req.body, name, targetDate.format(ISO_FORMAT));
    } else {
      assert.match(_.get(req.body, name), /\d{4}-\d{2}-\d{2}/);
    }
  }
);

Then(
  /^I expect that element "(.+)" contains the (iso date|formatted date|native formatted date) matching next year's "(.+)", "(.+)"$/,
  (selector, type, month, date) => {
    const el = browser.elements(selector);
    const text = (el.getValue() || el.getText() || '').trim();
    const targetDate = momentFromMonthDateNextYear(month, date);
    const selectedFormat = getDateFormat(type);

    assert.equal(text, targetDate.format(selectedFormat));
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
  /^I select day "(\d+)" of the month "(\w+)" of next year(?: and day "(\d+)" of the month "(\w+)" of next year)?$/,
  (date, month, endDate, endMonth) => {
    const selectedMoment = getSelectedMoment();
    const startMoment = momentFromMonthDateNextYear(month, date);
    const clicksToStartMonth = computeClicks(selectedMoment, startMoment);
    increaseMonth(clicksToStartMonth);
    clickDay(date);

    if (endDate && endMonth) {
      const endMoment = momentFromMonthDateNextYear(endMonth, endDate);

      const clicksToEndMonth = computeClicks(startMoment, endMoment);
      increaseMonth(clicksToEndMonth);
      clickDay(endDate);
    }
  }
);

When(/^I select day "(\d+)" of the next month$/, async (dayString) => {
  $('.daterangepicker .next').click();
  clickDay(dayString);
});

When(/^I select the autocomplete option with the text "(.+)"$/, (text) => {
  const xpath = `.//*[text() = '${text}']`;
  const {value: elements} = browser.element('.results').elements(xpath);

  if (elements.length === 0) {
    throw new Error(`Could not locate element with XPath ${xpath}`);
  }

  if (elements.length > 1) {
    throw new Error(`More than one element matched XPath ${xpath}`);
  } else {
    browser.elementIdClick(elements[0].ELEMENT);
  }
});

When(
  /^I set "(.+)", "(.+)" of next year to the (date|text) input "(.+)"$/,
  (month, date, type, selector) => {
    const targetDate = momentFromMonthDateNextYear(month, date);

    if (type === 'date') {
      setInputField('set', targetDate.format(ISO_FORMAT), selector);
    } else if (type === 'text') {
      setInputField('set', targetDate.format(NATIVE_DISPLAY_FORMAT), selector);
    } else {
      throw new Error('type must be "date" or "text"');
    }
  }
);

function momentFromMonthDateNextYear(month, date) {
  return moment()
    .month(month)
    .date(date)
    .year(moment().year() + 1);
}

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

function getSelectedMoment() {
  const [selectedMonthString, selectedYearString] = browser
    .element('.drp-calendar.left .month')
    .getText()
    .split(' ');

  const selectedMoment = stringsToMoment(
    selectedYearString,
    selectedMonthString,
    '1'
  );

  return selectedMoment;
}

function getDateFormat(dateType) {
  switch (dateType) {
    case 'iso date':
      return ISO_FORMAT;
    case 'formatted date':
      return DISPLAY_FORMAT;
    case 'native formatted date':
      return NATIVE_DISPLAY_FORMAT;
    default:
      throw new Error(`Invalid date type of ${dateType} supplied`);
  }
}
