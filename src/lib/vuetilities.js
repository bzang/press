import {after, getAttributeNames} from './polyfills';

/**
 * Creates a hidden input binding a v-model to a name
 * @param {HTMLElement} el
 * @param {Object} [options]
 * @param {string} options.name - the `name` to use on the hidden element. if
 * not specified, will be extract from `el`.
 * @param {string} options.vModel - the `v-model` to use on the hidden
 * element. if not specified, will be extract from `el`.
 * @param {string|null} [options.value] - initial value for the element
 */
export function bindToHiddenInput(el, options = {name: '', vModel: ''}) {
  const name = options.name || el.getAttribute('name');
  const vModel = options.vModel || el.getAttribute('v-model');
  const value =
    'value' in options ? options.value : el.getAttribute('value') || '';
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
  if (value) {
    hidden.setAttribute('value', value);
  }
  // The only time we should be using this function is when we want to use the
  // value in the hidden input instead of the press component, so we don't want
  // the original to keep its name and therefore submit to values for the same
  // name
  el.removeAttribute('name');

  after(el, hidden);
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

    return '';
  });
  return result.join('.');
}

/**
 * Detects or infers an element's v-model
 * @param {HTMLElement} el
 * @returns {string}
 */
export function vModelFromNode(el) {
  const vModelName = el.getAttribute(
    getAttributeNames(el).includes('v-model') ? 'v-model' : 'name'
  );

  if (!vModelName) {
    throw new Error('v-model name cannot be determined from element');
  }

  return normalizeKeyPath(vModelName);
}

/**
 * Causes `el` to be removed from the DOM when Vue initializes
 * @param {HTMLElement} el
 */
export function hideWhenVued(el) {
  el.setAttribute('v-if', 'false');
}
