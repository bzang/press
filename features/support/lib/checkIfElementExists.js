const {expect} = require('chai');

/**
 * Check if the given element exists in the DOM one or more times
 * @param  {string}  element    Element selector
 * @param  {boolean} [negate]   Check if the element (does not) exists
 * @param  {number}  [exactly]  Check if the element exists exactly this number
 *                              of times
 */
module.exports = (element, negate, exactly) => {
  const nrOfElements = browser.elements(element).value;

  if (negate === true) {
    expect(nrOfElements).to.have.lengthOf(
      0,
      `Element with selector "${element}" should not exist on the page`
    );
  } else if (exactly) {
    expect(nrOfElements).to.have.lengthOf(
      exactly,
      `Element with selector "${element}" should exist exactly ` +
        `${exactly} time(s)`
    );
  } else {
    expect(nrOfElements).to.have.length.of.at.least(
      1,
      `Element with selector "${element}" should exist on the page`
    );
  }
};
