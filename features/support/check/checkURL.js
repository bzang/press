const {expect} = require('chai');

/**
 * Check the URL of the given browser window
 * @param  {string}   [negate]   Whether to check if the URL matches the
 *                                expected value or not
 * @param  {string}   expectedUrl The expected URL to check against
 */
module.exports = (negate, expectedUrl) => {
  /**
   * The current browser window's URL
   * @type {String}
   */
  const currentUrl = browser.url().value;

  if (negate) {
    expect(currentUrl).to.not.equal(
      expectedUrl,
      `expected url not to be "${currentUrl}"`
    );
  } else {
    expect(currentUrl).to.equal(
      expectedUrl,
      `expected url to be "${expectedUrl}" but found ` + `"${currentUrl}"`
    );
  }
};
