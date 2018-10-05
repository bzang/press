/**
 * @param {HTMLElement} el
 * @returns {string[]}
 */
export function getAttributeNames(el) {
  // @ts-ignore
  if (typeof el.getAttributeNames === 'function') {
    // @ts-ignore
    return el.getAttributeNames();
  }

  const {attributes} = el;
  const {length} = attributes;
  const result = new Array(length);
  for (let i = 0; i < length; i++) {
    result[i] = attributes[i].name;
  }
  return result;
}
