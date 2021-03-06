const {expect} = require('chai');

/**
 * Check if a cookie with the given name exists
 * @param  {string}   name      The name of the cookie
 * @param  {boolean}   [negate] Whether or not to check if the cookie exists or
 *                              not
 */
module.exports = (name, negate) => {
  /**
   * The cookie as retrieved from the browser
   * @type {Object}
   */
  const cookie = browser.getCookie(name);

  if (negate) {
    expect(cookie).to.equal(
      null,
      `Expected cookie "${name}" not to exists but it does`
    );
  } else {
    expect(cookie).to.not.equal(
      null,
      `Expected cookie "${name}" to exists but it does not`
    );
  }
};
