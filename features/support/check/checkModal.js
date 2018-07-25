const {expect} = require('chai');

/**
 * Check if a modal was opened
 * @param  {string}   modalType  The type of modal that is expected (alertbox,
 *                               confirmbox or prompt)
 * @param  {string}   [negate] Whether to check if the modal was opened or not
 */
module.exports = (modalType, negate) => {
  let promptText;

  try {
    promptText = browser.alertText();

    if (negate) {
      expect(promptText).to.not.equal(
        null,
        `A ${modalType} was opened when it shouldn't`
      );
    }
  } catch (e) {
    if (!negate) {
      expect(promptText).to.equal(
        null,
        `A ${modalType} was not opened when it should have been`
      );
    }
  }
};
