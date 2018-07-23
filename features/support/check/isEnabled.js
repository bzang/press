const {expect} = require('chai');

/**
 * Check if the given element is enabled
 * @param  {string}   element   Element selector
 * @param  {string}   [falseCase] Whether to check if the given element is enabled
 *                              or not
 */
module.exports = (element, falseCase) => {
  /**
   * The enabled state of the given element
   * @type {Boolean}
   */
  const isEnabled = browser.isEnabled(element);

  if (falseCase) {
    expect(isEnabled).to.not.equal(
      true,
      `Expected element "${element}" not to be enabled`
    );
  } else {
    expect(isEnabled).to.equal(
      true,
      `Expected element "${element}" to be enabled`
    );
  }
};
