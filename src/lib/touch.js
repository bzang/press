import {get, has, set} from 'lodash';

/**
 * Ensures values exist at all leaves of a Vue app's initial data model. If a
 * value is already set to null, it may be overwritten.
 * @param {Object} obj
 * @param {string} path
 * @param {any} value
 */
export function touch(obj, path, value) {
  if (!has(obj, path) || get(obj, path) === null) {
    set(obj, path, value);
  }
}
