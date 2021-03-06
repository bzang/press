const {assert, expect} = require('chai');

/**
 * Check the text of a modal
 * @param  {string}   modalType     The type of modal that is expected
 *                                  (alertbox, confirmbox or prompt)
 * @param  {string}   [falseState]    Whether to check if the text matches or not
 * @param  {string}   expectedText  The text to check against
 */
module.exports = (modalType, falseState, expectedText) => {
  try {
    const text = browser.alertText();

    if (falseState) {
      expect(text).to.not.equal(
        expectedText,
        `Expected the text of ${modalType} not to equal ` + `"${expectedText}"`
      );
    } else {
      expect(text).to.equal(
        expectedText,
        `Expected the text of ${modalType} not to equal ` +
          `"${expectedText}", instead found "${text}"`
      );
    }
  } catch (e) {
    assert(e, `A ${modalType} was not opened when it should have been opened`);
  }
};
