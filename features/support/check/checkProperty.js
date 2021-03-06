const {expect} = require('chai');

/**
 * Check the given property of the given element
 * @param  {string}   isCSS         Whether to check for a CSS property or an
 *                                  attribute
 * @param  {string}   attrName      The name of the attribute to check
 * @param  {string}   elem          Element selector
 * @param  {string}   [negate]     Whether to check if the value of the
 *                                  attribute matches or not
 * @param  {string}   expectedValue The value to match against
 */
module.exports = (isCSS, attrName, elem, negate, expectedValue) => {
  /**
   * The command to use for fetching the expected value
   * @type {String}
   */
  const command = isCSS ? 'getCssProperty' : 'getAttribute';

  /**
   * Te label to identify the attribute by
   * @type {String}
   */
  const attrType = isCSS ? 'CSS attribute' : 'Attribute';

  /**
   * The actual attribute value
   * @type {any}
   */
  let attributeValue = browser[command](elem, attrName);

  /**
   * when getting something with a color or font-weight WebdriverIO returns a
   * object but we want to assert against a string
   */
  if (attrName.match(/(color|font-weight)/)) {
    attributeValue = attributeValue.value;
  }

  if (negate) {
    expect(attributeValue).to.not.equal(
      expectedValue,
      `${attrType} of element "${elem}" should not contain ` +
        `"${attributeValue}"`
    );
  } else {
    expect(attributeValue).to.equal(
      expectedValue,
      `${attrType} of element "${elem}" should not contain ` +
        `"${attributeValue}", but "${expectedValue}"`
    );
  }
};
