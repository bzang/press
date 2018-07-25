/**
 * Delete a cookie
 * @param  {string}   name The name of the cookie to delete
 */
module.exports = (name) => {
  browser.deleteCookie(name);
};
