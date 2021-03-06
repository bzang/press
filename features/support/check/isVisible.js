const {expect} = require('chai');

/**
 * Check if the given element is (not) visible
 * @param  {string}   element   Element selector
 * @param  {string}   [negate] Check for a visible or a hidden element
 */
module.exports = (element, negate) => {
  const isVisible = browser.isVisible(element);

  if (negate) {
    expect(isVisible).to.not.equal(
      true,
      `Expected element "${element}" not to be visible`
    );
  } else {
    expect(isVisible).to.equal(
      true,
      `Expected element "${element}" to be visible`
    );
  }
};
