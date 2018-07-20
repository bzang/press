import './style.css';

import {mergeWith} from 'lodash';
import Vue from 'vue';
import VeeValidate from 'vee-validate';
import DatePicker from './components/press-datepicker.vue';

import * as formApp from './apps/form';

Vue.use(VeeValidate);
Vue.component('press-datepicker', DatePicker);

const vueLifecycleMethods = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed'
];

const appDefs = new Map();
function registerApp(name, appMethods) {
  appDefs.set(name, appMethods);
}

registerApp('form', formApp);

function invokeAppDef(appName, methodName, ...args) {
  const appDef = appDefs.get(appName);
  if (!appDef) {
    return;
  }

  const method = appDef[methodName];
  if (!method) {
    return;
  }
  return method(...args);
}

/** @type {WeakMap<HTMLElement, Object}> */
const models = new WeakMap();

performance.mark('press:infer:start');
document.querySelectorAll('form:not([data-press-app])').forEach(inferAppType);
performance.mark('press:infer:finish');

performance.mark('press:locate_apps:start');
const appNodes = document.querySelectorAll(
  '[data-press-app]:not([data-press-app="disable"]'
);
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
  if (el.matches(`[data-press-app] ${el.nodeName.toLowerCase()}`)) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn(
        'PRESS does not currently support nesting apps within apps. You can find the nested apps on this page by running `document.querySelectorAll("[data-press-app] [data-press-app]")'
      );
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
  const data = {
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
  const data = models.get(el);
  const options = {
    el,
    data,
    mounted() {
      // run on nextTick to avoid potentially showing the error divs before we
      // finish initializing
      this.$nextTick(() => {
        this.isMounted = true;
      });
    }
  };

  const appOptions = invokeAppDef(el.dataset.pressApp, 'extend', el);

  mergeWith(options, appOptions, (objValue, srcValue, key) => {
    // If either of the values to merge are undefined, fall back to lodash's
    // default merge behavior
    if (typeof objValue === 'undefined' || typeof srcValue === 'undefined') {
      return undefined;
    }

    // In event of a collision of lifecycle methods, combine them, running
    // the core lifecycle method before the app - specific one
    if (vueLifecycleMethods.includes(key)) {
      return function(...args) {
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

  new Vue(options);
}

/* eslint-disable no-console */
if (process.env.NODE_ENV !== 'production' && console && console.table) {
  console.table(
    performance
      .getEntriesByType('mark')
      .map(({name, startTime}) => [name, startTime])
  );
}
/* eslint-enable no-console */
