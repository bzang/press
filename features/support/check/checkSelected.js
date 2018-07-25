const {expect} = require('chai');

/**
 * Check the selected state of the given element
 * @param  {string}   element   Element selector
 * @param  {string}   [negate] Whether to check if the element is elected or
 *                              not
 */
module.exports = (element, negate) => {
  /**
   * The selected state
   * @type {Boolean}
   */
  const isSelected = browser.isSelected(element);

  if (negate) {
    expect(isSelected).to.not.equal(
      true,
      `"${element}" should not be selected`
    );
  } else {
    expect(isSelected).to.equal(true, `"${element}" should be selected`);
  }
};
