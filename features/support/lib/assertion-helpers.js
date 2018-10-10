'use strict';
const _ = require('lodash');
const {assert} = require('chai');
// for typescript
// eslint-disable-next-line no-unused-vars
const moment = require('moment');

/** @typedef {moment.Moment|RegExp|string} Expectable */

/**
 * @param {string} keypath
 * @param {Expectable} expected
 */
function expectServer(keypath, expected) {
  const req = JSON.parse(
    browser
      .elements('#last-req')
      .getText()
      .trim()
  );
  assert.nestedProperty(req.body, keypath);
  const actual = _.get(req.body, keypath);
  assertTextOrPatternOrDate(
    actual,
    expected,
    `Expected value ${actual} at keypath to match ${expected}`
  );
}
exports.expectServer = expectServer;

/**
 * Asserts that the specified selector contains a value matching value
 * @param {string} sel
 * @param {Expectable} expected
 */
function expectText(sel, expected) {
  const actual = browser.getText(sel);
  assertTextOrPatternOrDate(actual, expected);
}
exports.expectText = expectText;

/**
 * @param {string} actual
 * @param {Expectable} expected
 * @param {string} [msg]
 */
function assertTextOrPatternOrDate(actual, expected, msg) {
  if (typeof expected === 'string') {
    assert.equal(actual, expected, msg);
  } else if (expected instanceof RegExp) {
    assert.match(actual, expected, msg);
  } else {
    assert.equal(actual, expected.toISOString().split('T')[0], msg);
  }
}
exports.assertTextOrPatternOrDate = assertTextOrPatternOrDate;

/**
 * Asserts that the specified selector contains a value matching value
 * @param {string} sel
 * @param {Expectable} expected
 */
function expectValue(sel, expected) {
  const actual = browser.getValue(sel);
  assertTextOrPatternOrDate(actual, expected);
}
exports.expectValue = expectValue;
