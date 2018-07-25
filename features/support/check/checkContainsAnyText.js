const {expect} = require('chai');

/**
 * Check if the given elements contains text
 * @param  {string}   elementType   Element type (element or button)
 * @param  {string}   element       Element selector
 * @param  {boolean}  [negate]   Whether to check if the content contains
 *                                  text or not
 */
module.exports = (elementType, element, negate) => {
  /**
   * The command to perform on the browser object
   * @type {String}
   */
  let command = 'getValue';

  if (
    elementType === 'button' ||
    browser.getAttribute(element, 'value') === null
  ) {
    command = 'getText';
  }

  /**
   * False case
   * @type {Boolean}
   */
  let boolnegate;

  /**
   * The text of the element
   * @type {String}
   */
  const text = browser[command](element);

  if (typeof negate === 'undefined') {
    boolnegate = false;
  } else {
    boolnegate = !!negate;
  }

  if (boolnegate) {
    expect(text).to.equal('');
  } else {
    expect(text).to.not.equal('');
  }
};
