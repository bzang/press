'use strict';
const _ = require('lodash');
const {assert} = require('chai');
// for typescript
// eslint-disable-next-line no-unused-vars
const moment = require('moment');

/** @typedef {moment.Moment|RegExp|any[]|string} Expectable */

/**
 * @param {string} keypath
 * @param {Expectable} expected
 */
function expectServer(keypath, expected) {
  browser.waitUntil(
    () => {
      try {
        const text = browser.getText('#last-req');
        const obj = JSON.parse(text);
        assert.notDeepEqual(obj, {});
        if (!obj.body) {
          return false;
        }
        assert.notDeepEqual(obj.body, {});
        return true;
      } catch (err) {
        return false;
      }
    },
    5000,
    'Timed-out waiting for the server to process the request'
  );
  const req = JSON.parse(browser.getText('#last-req').trim());
  assert.nestedProperty(req.body, keypath);
  const actual = _.get(req.body, keypath);
  smartAssert(
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
  smartAssert(actual, expected);
}
exports.expectText = expectText;

/**
 * @param {Object|string} actual
 * @param {Expectable} expected
 * @param {string} [msg]
 */
function smartAssert(actual, expected, msg) {
  if (typeof expected === 'string') {
    assert.equal(actual, expected, msg);
  } else if (expected instanceof RegExp) {
    assert.match(actual, expected, msg);
  } else if (moment.isMoment(expected)) {
    assert.equal(actual, expected.toISOString().split('T')[0], msg);
  } else {
    assert.deepEqual(actual, expected);
  }
}
exports.assertTextOrPatternOrDate = smartAssert;

/**
 * Asserts that the specified selector contains a value matching value
 * @param {string} sel
 * @param {Expectable} expected
 */
function expectValue(sel, expected) {
  const actual = browser.getValue(sel);
  assert.isNotArray(
    actual,
    `Expected ${sel} to describe exactly one element on the page`
  );
  smartAssert(actual, expected);
}
exports.expectValue = expectValue;
