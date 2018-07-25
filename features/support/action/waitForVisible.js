/**
 * Wait for the given element to become visible
 * @param  {string}   elem      Element selector
 * @param  {string}   [negate] Whether or not to expect a visible or hidden
 *                              state
 *
 * @todo  merge with waitfor
 */
module.exports = (elem, negate) => {
  /**
   * Maximum number of milliseconds to wait for
   * @type {number}
   */
  const ms = 10000;

  browser.waitForVisible(elem, ms, !!negate);
};
