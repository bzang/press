/**
 * Drag a element to a given destination
 * @param  {string}   source      The selector for the source element
 * @param  {string}   destination The selector for the destination element
 */
module.exports = (source, destination) => {
  browser.dragAndDrop(source, destination);
};
