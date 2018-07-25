/**
 * Set a given cookie to a given value. When the cookies does not exist it will
 * be created
 * @param  {string}   cookieName    The name of the cookie
 * @param  {string}   cookieContent The value of the cookie
 */
module.exports = (cookieName, cookieContent) => {
  browser.setCookie({
    name: cookieName,
    value: cookieContent
  });
};
