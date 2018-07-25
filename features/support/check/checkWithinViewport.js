const {expect} = require('chai');

/**
 * Check if the given element is visible inside the current viewport
 * @param  {string}   element   Element selector
 * @param  {string}   [negate] Whether to check if the element is visible
 *                              within the current viewport or not
 */
module.exports = (element, negate) => {
  /**
   * The state of visibility of the given element inside the viewport
   * @type {Boolean}
   */
  const isVisible = browser.isVisibleWithinViewport(element);

  if (negate) {
    expect(isVisible).to.not.equal(
      true,
      `Expected element "${element}" to be outside the viewport`
    );
  } else {
    expect(isVisible).to.equal(
      true,
      `Expected element "${element}" to be inside the viewport`
    );
  }
};
