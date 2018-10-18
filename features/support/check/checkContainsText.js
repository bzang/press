const {expect} = require('chai');
/**
 * Check if the given elements contains text
 * @param  {string}   elementType   Element type (element or button)
 * @param  {string}   element       Element selector
 * @param  {string}   [negate]     Whether to check if the content contains
 *                                  the given text or not
 * @param  {string}   expectedText  The text to check against
 */
module.exports = (elementType, element, negate, expectedText) => {
  if (typeof expectedText === 'undefined') {
    expectedText = '';
  }

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
   * The expected text
   * @type {String}
   */
  let stringExpectedText = expectedText;

  /**
   * The text of the element
   * @type {String}
   */
  const text = browser[command](element);

  if (typeof expectedText === 'undefined') {
    stringExpectedText = negate;
    boolnegate = false;
  } else {
    boolnegate = negate === ' not';
  }

  if (boolnegate) {
    expect(text).to.not.contain(stringExpectedText);
  } else {
    expect(text).to.contain(stringExpectedText);
  }
};
