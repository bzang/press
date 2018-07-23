const {expect} = require('chai');

/**
 * Check the content of a cookie against a given value
 * @param  {string}   name          The name of the cookie
 * @param  {string}   [falseCase]     Whether or not to check if the value matches
 *                                  or not
 * @param  {string}   expectedValue The value to check against
 */
module.exports = (name, falseCase, expectedValue) => {
  /**
   * The cookie retrieved from the browser object
   * @type {Object}
   */
  const cookie = browser.getCookie(name);

  expect(cookie.name).to.equal(name, `no cookie found with the name "${name}"`);

  if (falseCase) {
    expect(cookie.value).to.not.equal(
      expectedValue,
      `expected cookie "${name}" not to have value "${expectedValue}"`
    );
  } else {
    expect(cookie.value).to.equal(
      expectedValue,
      `expected cookie "${name}" to have value "${expectedValue}"` +
        ` but got "${cookie.value}"`
    );
  }
};
