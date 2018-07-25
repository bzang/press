const checkIfElementExists = require('../lib/checkIfElementExists');

/**
 * Set the value of the given input field to a new value or add a value to the
 * current element value
 * @param  {string}   method  The method to use (add or set)
 * @param  {string}   value   The value to set the element to
 * @param  {string}   element Element selector
 */
module.exports = (method, value, element) => {
  /**
   * The command to perform on the browser object (addValue or setValue)
   * @type {String}
   */
  const command = method === 'add' ? 'addValue' : 'setValue';

  let checkValue = value;

  checkIfElementExists(element, false, 1);

  if (!value) {
    checkValue = '';
  }

  $(element).click();
  browser[command](element, checkValue);
  $('body').click();
};
