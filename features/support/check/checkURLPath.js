const {expect} = require('chai');

/**
 * Check if the current URL path matches the given path
 * @param  {string}   [negate]    Whether to check if the path matches the
 *                                 expected value or not
 * @param  {string}   expectedPath The expected path to match against
 */
module.exports = (negate, expectedPath) => {
  /**
   * The URL of the current browser window
   * @type {String}
   */
  let currentUrl = browser.url().value.replace(/http(s?):\/\//, '');

  /**
   * The base URL of the current browser window
   * @type {Object}
   */
  const domain = `${currentUrl.split('/')[0]}`;

  currentUrl = currentUrl.replace(domain, '');

  if (negate) {
    expect(currentUrl).to.not.equal(
      expectedPath,
      `expected path not to be "${currentUrl}"`
    );
  } else {
    expect(currentUrl).to.equal(
      expectedPath,
      `expected path to be "${expectedPath}" but found ` + `"${currentUrl}"`
    );
  }
};
