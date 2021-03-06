const {expect} = require('chai');

/**
 * Check if the given element has the focus
 * @param  {string}   selector  Element selector
 * @param  {string}   [negate] Whether to check if the given element has focus
 *                              or not
 */
module.exports = (selector, negate) => {
  /**
   * Value of the hasFocus function for the given element
   * @type {Boolean}
   */
  const hasFocus = browser.hasFocus(selector);

  if (negate) {
    expect(hasFocus).to.not.equal(
      true,
      'Expected element to not be focused, but it is'
    );
  } else {
    expect(hasFocus).to.equal(
      true,
      'Expected element to be focused, but it is not'
    );
  }
};
