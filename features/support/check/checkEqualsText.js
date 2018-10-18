/**
 * Check if the given elements text is the same as the given text
 * @param  {string}   elementType   Element type (element or button)
 * @param  {string}   element       Element selector
 * @param  {string}   [negate]     Whether to check if the content equals the
 *                                  given text or not
 * @param  {string}   expectedText  The text to validate against
 */
module.exports = (elementType, element, negate, expectedText) => {
  if (typeof expectedText === 'undefined') {
    expectedText = '';
  }

  /**
   * The command to execute on the browser object
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
   * The expected text to validate against
   * @type {String}
   */
  let parsedExpectedText = expectedText;

  /**
   * Whether to check if the content equals the given text or not
   * @type {Boolean}
   */
  let boolnegate = !!negate;

  // Check for empty element
  if (typeof parsedExpectedText === 'function') {
    parsedExpectedText = '';

    boolnegate = !boolnegate;
  }

  if (parsedExpectedText === undefined && negate === undefined) {
    parsedExpectedText = '';
    boolnegate = true;
  }

  const text = browser[command](element);

  if (boolnegate) {
    parsedExpectedText.should.not.equal(text);
  } else {
    parsedExpectedText.should.equal(text);
  }
};
