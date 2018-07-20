/**
 * Select a option from a select element by it's index
 * @param  {string}   index      The index of the option
 * @param  {string}   obsolete   The ordinal indicator of the index (unused)
 * @param  {string}   selectElem Element selector
 *
 * @todo  merge with selectOption
 */
module.exports = (index, obsolete, selectElem) => {
  /**
   * The index of the option to select
   * @type {Int}
   */
  const optionIndex = parseInt(index, 10);

  browser.selectByIndex(selectElem, optionIndex);
};
