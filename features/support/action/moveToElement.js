/**
 * Move to the given element with an optional offset on a X and Y position
 * @param  {string}   element  Element selector
 * @param  {string}   x        X coordinate to move to
 * @param  {string}   y        Y coordinate to move to
 */
module.exports = (element, x, y) => {
  /**
   * X coordinate
   * @type {number}
   */
  const intX = parseInt(x, 10) || undefined;

  /**
   * Y coordinate
   * @type {number}
   */
  const intY = parseInt(y, 10) || undefined;

  browser.moveToObject(element, intX, intY);
};
