import {has, set} from 'lodash';

/**
 * Ensures values exist at all leaves of a Vue app's initial data model
 * @param {Object} obj
 * @param {string} path
 * @param {any} value
 */
export function touch(obj, path, value) {
  if (!has(obj, path)) {
    set(obj, path, value);
  }
}
