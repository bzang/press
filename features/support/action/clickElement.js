const checkIfElementExists = require('../lib/checkIfElementExists');

/**
 * Perform an click action on the given element
 * @param  {string}   action  The action to perform (click or doubleClick)
 * @param  {string}   type    Type of the element (link or selector)
 * @param  {string}   element Element selector
 */
module.exports = (action, type, element) => {
  /**
   * Element to perform the action on
   * @type {String}
   */
  const elem = type === 'link' ? `=${element}` : element;

  /**
   * The method to call on the browser object
   * @type {String}
   */
  const method = action === 'click' ? 'click' : 'doubleClick';

  checkIfElementExists(elem);

  browser[method](elem);
};
