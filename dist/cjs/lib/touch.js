'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _set2 = require('lodash/set');

var _set3 = _interopRequireDefault(_set2);

var _has2 = require('lodash/has');

var _has3 = _interopRequireDefault(_has2);

exports.touch = touch;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Ensures values exist at all leaves of a Vue app's initial data model
 * @param {Object} obj
 * @param {string} path
 * @param {any} value
 */
function touch(obj, path, value) {
  if (!(0, _has3.default)(obj, path)) {
    (0, _set3.default)(obj, path, value);
  }
  // FIXME if (is null, allow overwrite)
}