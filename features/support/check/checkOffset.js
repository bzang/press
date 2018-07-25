const {expect} = require('chai');

/**
 * Check the offset of the given element
 * @param  {string}   elem              Element selector
 * @param  {string}   [negate]          Whether to check if the offset matches
 *                                      or not
 * @param  {string}   expectedPosition  The position to check against
 * @param  {'x'|'y'}  axis              The axis to check on (x or y)
 */
module.exports = (elem, negate, expectedPosition, axis) => {
  /**
   * Get the location of the element on the given axis
   */
  const location = browser.getLocation(elem, axis);

  /**
   * Parsed expected position
   * @type {number}
   */
  const intExpectedPosition = parseInt(expectedPosition, 10);

  if (negate) {
    expect(location).to.not.equal(
      intExpectedPosition,
      `Element "${elem}" should not be positioned at ` +
        `${intExpectedPosition}px on the ${axis} axis`
    );
  } else {
    expect(location).to.equal(
      intExpectedPosition,
      `Element "${elem}" should be positioned at ` +
        `${intExpectedPosition}px on the ${axis} axis, but was found ` +
        `at ${location}px`
    );
  }
};
