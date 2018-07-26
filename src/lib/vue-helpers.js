/**
 * Creates a hidden input binding a v-model to a name
 * @param {HTMLElement} el
 * @param {Object} [options]
 * @param {string} [options.name] - the `name` to use on the hidden element. if
 * not specified, will be extract from `el`.
 * @param {string} [options.vModel] - the `v-model` to use on the hidden
 * element. if not specified, will be extract from `el`.
 */
export function bindToHiddenInput(el, options = {}) {
  const name = options.name || el.getAttribute('name');
  const vModel = options.vModel || el.getAttribute('v-model');

  if (!name) {
    throw new Error(
      'Cannot bind hidden input without a name parameter or attribute'
    );
  }

  if (!vModel) {
    throw new Error(
      'Cannot bind hidden input without a vModel parameter or v-model attribute'
    );
  }

  const hidden = document.createElement('input');
  hidden.setAttribute('type', 'hidden');
  hidden.setAttribute('name', name);
  hidden.setAttribute('v-model', vModel);

  el.after(hidden);
}

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

/**
 * Detects or infers an element's v-model
 * @param {HTMLElement} el
 * @returns {string}
 */
export function vModelFromNode(el) {
  if (el.getAttributeNames().includes('v-model')) {
    return el.getAttribute('v-model');
  } else {
    return el.getAttribute('name');
  }
}
