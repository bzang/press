const {expect} = require('chai');

/**
 * Check if the given element exists in the current DOM
 * @param  {string}   selector  Element selector
 * @param  {string}   [negate] Whether to check if the element exists or not
 */
module.exports = (selector, negate) => {
  /**
   * Elements found in the DOM
   * @type {Object}
   */
  const elements = browser.elements(selector).value;

  if (negate) {
    expect(elements).to.have.lengthOf(
      0,
      `Expected element "${selector}" not to exist`
    );
  } else {
    expect(elements).to.have.length.above(
      0,
      `Expected element "${selector}" to exist`
    );
  }
};
