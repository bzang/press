const checkIfElementExists = require('../lib/checkIfElementExists');

/**
 * Check if the given element exists
 * @param  {string}   isExisting Whether the element should be existing or not
 *                               (an or no)
 * @param  {string}   elem       Element selector
 */
module.exports = (isExisting, elem) => {
  /**
   * Falsecase assertion
   * @type {Boolean}
   */
  let falseCase = true;

  if (isExisting === 'an') {
    falseCase = false;
  }

  checkIfElementExists(elem, falseCase);
};
