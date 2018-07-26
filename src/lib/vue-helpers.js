/** Used to match property names within property paths. */
const rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/** Used to match backslashes in property paths. */
const reEscapeChar = /\\(\\)?/g;

/**
 * Normalizes a deep object reference. adapted from lodash's private
 * _stringToPath.js
 *
 * @param {string} string The string to convert.
 * @returns {string} Returns the property path array.
 */
export function normalizeKeyPath(string) {
  const result = [];
  if (string.charCodeAt(0) === 46 /* . */) {
    result.push('');
  }

  string.replace(rePropName, (match, number, quote, subString) => {
    result.push(
      quote ? subString.replace(reEscapeChar, '$1') : number || match
    );

    return undefined;
  });
  return result.join('.');
}
