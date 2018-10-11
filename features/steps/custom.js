'use strict';

const {Given, Then, When} = require('cucumber');
const {assert} = require('chai');
const moment = require('moment');

const {expectServer} = require('../support/lib/assertion-helpers');
const {momentFromMonthDateNextYear} = require('../support/lib/moment-helpers');
const checkTitle = require('../support/check/checkTitle');
const openWebsite = require('../support/action/openWebsite');
const setInputField = require('../support/action/setInputField');

const {whenSubmitThen} = require('./custom/when-submit-then');

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

Then('I expect elements that match the following conditions', (table) => {
  table.rows().forEach(([id, condition]) => {
    const sel = `#${id}${condition}`;
    const el = browser.element(sel);
    assert.notEqual(
      // @ts-ignore el.type does exist on el
      el.type,
      'NoSuchElement',
      `Could not locate element with selector ${sel}`
    );
  });
});

Then('I expect elements that contain the following text', (table) => {
  table.rows().forEach(([id, text]) => {
    const el = browser.element(`#${id}`);
    assert.equal(el.getText(), text);
  });
});

Then(
  /^I expect the server received a form parameter named "(.+)" with a value (?:of "(.+)"|matching \/(.+)\/)$/,
  (name, value, pattern) => {
    expectServer(name, pattern ? new RegExp(pattern) : JSON.parse(value));
  }
);

Then(
  /^I expect the server received an iso date named "(.+)"(?: of "(.+)", "(.+)" of next year)?$/,
  (name, month, date) => {
    if (month && date) {
      const targetDate = momentFromMonthDateNextYear(month, date);
      expectServer(name, targetDate);
    } else {
      expectServer(name, /\d{4}-\d{2}-\d{2}/);
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
  /^I submit a form using (?:the "(.+)" key|element "(.+)"), I expect (ISO Dates|next year's dates to be represented|values) in the following places$/,
  whenSubmitThen
);

When(
  /^I set "(.+)", "(.+)" of next year to the (date|text) input "(.+)"$/,
  (month, date, type, selector) => {
    const targetDate = momentFromMonthDateNextYear(month, date);

    if (type === 'date') {
      setInputField('set', targetDate.format(ISO_FORMAT), selector);
    } else if (type === 'text') {
      setInputField('set', targetDate.format(DISPLAY_FORMAT), selector);
    } else {
      throw new Error('type must be "date" or "text"');
    }
  }
);

/**
 * @param {moment.Moment} current
 * @param {moment.Moment} target
 * @returns {number}
 */
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

/**
 * @param {number} year
 * @param {number|string} month
 * @param {number} date
 * @returns {moment.Moment}
 */
function stringsToMoment(year, month, date) {
  return moment()
    .year(year)
    .month(month)
    .date(date);
}

/**
 * @param {number} count
 */
function increaseMonth(count) {
  for (let i = 0; i < count; i++) {
    // we need to reselect the element after each click; otherwise, it seems
    // to become a different node sometimes
    $('.daterangepicker .next').click();
  }
}

/**
 * @param {string} dayString
 */
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
        return undefined;
      }
      return !classes.value.includes('off');
    });

    browser.elementIdClick(el.ELEMENT);
  } else {
    browser.elementIdClick(elements[0].ELEMENT);
  }
}

/**
 * @returns {moment.Moment}
 */
function getSelectedMoment() {
  const [selectedMonthString, selectedYearString] = browser
    .element('.drp-calendar.left .month')
    .getText()
    .split(' ');

  const selectedMoment = stringsToMoment(
    Number(selectedYearString),
    selectedMonthString,
    1
  );

  return selectedMoment;
}

/**
 * Converts human-readable string to enum value
 * @param {string} dateType
 * @returns {string}
 */
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
