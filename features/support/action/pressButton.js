/**
 * Perform a key press
 * @param  {string}   key  The key to press
 */
module.exports = (key) => {
  browser.keys(key);
};
