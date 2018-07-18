/**
 * Resize the browser window
 * @param  {string}   screenWidth  The width of the window to resize to
 * @param  {string}   screenHeight The height of the window to resize to
 */
module.exports = (screenWidth, screenHeight) => {
  browser.windowHandleSize({
    width: parseInt(screenWidth, 10),
    height: parseInt(screenHeight, 10)
  });
};
