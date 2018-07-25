const checkIfElementExists = require('../lib/checkIfElementExists');

/**
 * Check if the given element exists
 * @param  {string}   isExisting Whether the element should be existing or not
 *                               (an or no)
 * @param  {string}   elem       Element selector
 */
module.exports = (isExisting, elem) => {
  /**
   * negate assertion
   * @type {Boolean}
   */
  let negate = true;

  if (isExisting === 'an') {
    negate = false;
  }

  checkIfElementExists(elem, negate);
};
