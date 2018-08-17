/**
 * Converts an HTML attribute string to a CSS selector
 * by pre-pending each word in a class string with a period
 * e.g. "one two three" => ".one .two .three';
 * @param {string} attr
 * @returns {string}
 */
export function attributeToClassSelector(attr) {
  return attr
    .split(' ')
    .map((str) => `.${str}`)
    .join('');
}
