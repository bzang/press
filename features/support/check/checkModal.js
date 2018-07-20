/**
 * Check if a modal was opened
 * @param  {string}   modalType  The type of modal that is expected (alertbox,
 *                               confirmbox or prompt)
 * @param  {string}   falseState Whether to check if the modal was opened or not
 */
module.exports = (modalType, falseState) => {
  /**
   * The text of the prompt
   * @type {String}
   */
  let promptText = '';

  try {
    promptText = browser.alertText();

    if (falseState) {
      expect(promptText).to.not.equal(
        null,
        `A ${modalType} was opened when it shouldn't`
      );
    }
  } catch (e) {
    if (!falseState) {
      expect(promptText).to.equal(
        null,
        `A ${modalType} was not opened when it should have been`
      );
    }
  }
};
