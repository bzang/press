const {expect} = require('chai');

/**
 * Check the dimensions of the given element
 * @param  {string}   elem         Element selector
 * @param  {string}   falseCase    Whether to check if the dimensions match or
 *                                 not
 * @param  {string}   expectedSize Expected size
 * @param  {string}   dimension    Dimension to check (broad or tall)
 */
module.exports = (elem, falseCase, expectedSize, dimension) => {
  /**
   * The size of the given element
   * @type {Object}
   */
  const elementSize = browser.getElementSize(elem);

  /**
   * Parsed size to check for
   * @type {number}
   */
  const intExpectedSize = parseInt(expectedSize, 10);

  /**
   * The size property to check against
   * @type {number}
   */
  let origionalSize = elementSize.height;

  /**
   * The label of the checked property
   * @type {String}
   */
  let label = 'height';

  if (dimension === 'broad') {
    origionalSize = elementSize.width;
    label = 'width';
  }

  if (falseCase) {
    expect(origionalSize).to.not.equal(
      intExpectedSize,
      `Element "${elem}" should not have a ${label} of ` +
        `${intExpectedSize}px`
    );
  } else {
    expect(origionalSize).to.equal(
      intExpectedSize,
      `Element "${elem}" should have a ${label} of ` +
        `${intExpectedSize}px, but is ${origionalSize}px`
    );
  }
};
