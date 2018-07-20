/**
 * Open the given URL
 * @param  {string}   type Type of navigation (url or site)
 * @param  {string}   page The URL to navigate to
 */
module.exports = (type, page) => {
  /**
   * The URL to navigate to
   * @type {String}
   */
  const url = type === 'url' ? page : browser.options.baseUrl + page;

  browser.url(url);
};
