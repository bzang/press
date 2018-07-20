'use strict';

var _weakMap = require('babel-runtime/core-js/weak-map');

var _weakMap2 = _interopRequireDefault(_weakMap);

var _map = require('babel-runtime/core-js/map');

var _map2 = _interopRequireDefault(_map);

var _mergeWith2 = require('lodash/mergeWith');

var _mergeWith3 = _interopRequireDefault(_mergeWith2);

require('./style.css');

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

var _veeValidate = require('vee-validate');

var _veeValidate2 = _interopRequireDefault(_veeValidate);

var _pressDatepicker = require('./components/press-datepicker.vue');

var _pressDatepicker2 = _interopRequireDefault(_pressDatepicker);

var _form = require('./apps/form');

var formApp = _interopRequireWildcard(_form);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_vue2.default.use(_veeValidate2.default);
_vue2.default.component('press-datepicker', _pressDatepicker2.default);

var vueLifecycleMethods = ['beforeCreate', 'created', 'beforeMount', 'mounted', 'beforeUpdate', 'updated', 'beforeDestroy', 'destroyed'];

var appDefs = new _map2.default();
function registerApp(name, appMethods) {
  appDefs.set(name, appMethods);
}

registerApp('form', formApp);

function invokeAppDef(appName, methodName) {
  var appDef = appDefs.get(appName);
  if (!appDef) {
    return;
  }

  var method = appDef[methodName];
  if (!method) {
    return;
  }

  for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  return method.apply(undefined, args);
}

/** @type {WeakMap<HTMLElement, Object}> */
var models = new _weakMap2.default();

performance.mark('press:infer:start');
document.querySelectorAll('form:not([data-press-app])').forEach(inferAppType);
performance.mark('press:infer:finish');

performance.mark('press:locate_apps:start');
var appNodes = document.querySelectorAll('[data-press-app]:not([data-press-app="disable"]');
performance.mark('press:locate_apps:finish');

performance.mark('press:annotate:start');
appNodes.forEach(annotate);
performance.mark('press:annotate:finish');

performance.mark('press:model:start');
appNodes.forEach(generateModel);
performance.mark('press:model:finish');

performance.mark('press:instantiate:start');
appNodes.forEach(instantiate);
performance.mark('press:instantiate:finish');

/**
 * Infers app type based on element type
 * @param {HTMLElement} el
 */
function inferAppType(el) {
  el.setAttribute('data-press-app', el.nodeName.toLowerCase());
}

/**
 * Adds additional Vue markup to html contained below the app
 * @param {HTMLElement} el
 */
function annotate(el) {
  if (el.matches('[data-press-app] ' + el.nodeName.toLowerCase())) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn('PRESS does not currently support nesting apps within apps. You can find the nested apps on this page by running `document.querySelectorAll("[data-press-app] [data-press-app]")');
    }
    return;
  }

  // Set .press-mounted on the app; this lets us use css to hide v-if blocks
  // until the Vue lifecycle can take over.
  el.setAttribute(':class', '{ "press-mounted": isMounted }');

  invokeAppDef(el.dataset.pressApp, 'annotate', el);
}

/**
 * Generates a model object from v-model attributes
 * @param {HTMLElement} el
 */
function generateModel(el) {
  var data = {
    isMounted: false
  };
  invokeAppDef(el.dataset.pressApp, 'generateModel', el, data);
  models.set(el, data);
}

/**
 * Uses the appropriate app constructor to apply Vue to the el
 * @param {HTMLElement} el
 */
function instantiate(el) {
  var data = models.get(el);
  var options = {
    el: el,
    data: data,
    mounted: function mounted() {
      var _this = this;

      // run on nextTick to avoid potentially showing the error divs before we
      // finish initializing
      this.$nextTick(function () {
        _this.isMounted = true;
      });
    }
  };

  var appOptions = invokeAppDef(el.dataset.pressApp, 'extend', el);

  (0, _mergeWith3.default)(options, appOptions, function (objValue, srcValue, key) {
    // If either of the values to merge are undefined, fall back to lodash's
    // default merge behavior
    if (typeof objValue === 'undefined' || typeof srcValue === 'undefined') {
      return undefined;
    }

    // In event of a collision of lifecycle methods, combine them, running
    // the core lifecycle method before the app - specific one
    if (vueLifecycleMethods.includes(key)) {
      return function () {
        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        // This function gets called in the context of a Vue app
        /* eslint-disable no-invalid-this */

        // call the default lifecycle method
        objValue.apply(this, args);
        // then call the app's lifecycle method
        srcValue.apply(this, args);

        /* eslint-enable no-invalid-this */
      };
    }

    // For all other entries, prefer the app's version if it exists over the
    // core version
  });

  new _vue2.default(options);
}

/* eslint-disable no-console */
if (process.env.NODE_ENV !== 'production' && console && console.table) {
  console.table(performance.getEntriesByType('mark').map(function (_ref) {
    var name = _ref.name,
        startTime = _ref.startTime;
    return [name, startTime];
  }));
}
/* eslint-enable no-console */