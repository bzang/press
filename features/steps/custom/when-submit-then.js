'use strict';

// for typescript
// eslint-disable-next-line no-unused-vars
const moment = require('moment');

const {
  momentFromMonthDateNextYear
} = require('../../support/lib/moment-helpers');
const {
  expectServer,
  expectValue
} = require('../../support/lib/assertion-helpers');
const clickElement = require('../../support/action/clickElement');
const pressButton = require('../../support/action/pressButton');

/** @typedef {moment.Moment|RegExp|string} Expectable */
/** @typedef {"ISO Dates"|"next year's dates to be represented"|"values"} Mode */

/**
 * Extracts or constructs the expected value from the hash depending on mode
 * @param {Mode} mode
 * @param {Object} hash
 * @returns {Expectable}
 */
function getExpected(mode, hash) {
  if (mode === 'values') {
    return hash.Value;
  }

  if (mode === "next year's dates to be represented") {
    return momentFromMonthDateNextYear(hash.Month, hash.Date);
  }

  if (mode === 'ISO Dates') {
    return /\d{4}-\d{2}-\d{2}/;
  }

  throw new TypeError(
    `mode must be one of "ISO Dates", "next year's dates to be represented", or "values", not "${mode}"`
  );
}

/**
 * @param {Mode} mode
 * @param {string} sel
 * @param {Expectable} expected
 */
function assertBeforeSubmit(mode, sel, expected) {
  expectValue(sel, expected);
}

/**
 * @param {Mode} mode
 * @param {string} key
 * @param {Expectable} expected
 */
function assertServerAfterSubmit(mode, key, expected) {
  expectServer(key, expected);
}

/**
 *
 * @param {string} keyName
 * @param {string} buttonSelector
 * @param {Mode} mode
 * @param {any} table
 */
function whenSubmitThen(keyName, buttonSelector, mode, table) {
  /** @type {{sel: string, key: string, expected: string}[]} */
  const usable = table.hashes().map((hash) => ({
    expected: getExpected(mode, hash),
    key: hash['Form After Submit'],
    sel: hash['Element Before Submit']
  }));

  for (const {sel, expected} of usable) {
    assertBeforeSubmit(mode, sel, expected);
  }

  if (buttonSelector) {
    clickElement('click', 'selector', buttonSelector);
  } else {
    pressButton(keyName, ':focus');
  }

  for (const {key, expected} of usable) {
    assertServerAfterSubmit(mode, key, expected);
  }
}

exports.whenSubmitThen = whenSubmitThen;
