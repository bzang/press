import _set from 'lodash/set';
import _has from 'lodash/has';


/**
 * Ensures values exist at all leaves of a Vue app's initial data model
 * @param {Object} obj
 * @param {string} path
 * @param {any} value
 */
export function touch(obj, path, value) {
  if (!_has(obj, path)) {
    _set(obj, path, value);
  }
  // FIXME if (is null, allow overwrite)
}