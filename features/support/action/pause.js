/**
 * Pause execution for a given number of milliseconds
 * @param  {string}   ms   Number of milliseconds to pause
 */
module.exports = (ms) => {
  /**
   * Number of milliseconds
   * @type {number}
   */
  const intMs = parseInt(ms, 10);

  browser.pause(intMs);
};
