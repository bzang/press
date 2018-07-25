const {expect} = require('chai');

/**
 * Check if the given string is in the URL path
 * @param  {string}   [negate]       Whether to check if the given string is in
 *                                    the URL path or not
 * @param  {string}   expectedUrlPart The string to check for
 */
module.exports = (negate, expectedUrlPart) => {
  /**
   * The URL of the current browser window
   * @type {String}
   */
  const currentUrl = browser.url().value;

  if (negate) {
    expect(currentUrl).to.not.contain(
      expectedUrlPart,
      `Expected URL "${currentUrl}" not to contain ` + `"${expectedUrlPart}"`
    );
  } else {
    expect(currentUrl).to.contain(
      expectedUrlPart,
      `Expected URL "${currentUrl}" to contain "${expectedUrlPart}"`
    );
  }
};
