import Vue from 'vue';

import {touch} from './touch';
import {vModelFromNode, normalizeKeyPath} from './vue-helpers';
import {TypeNarrowingError} from './errors';
import {getAttributeNames} from './polyfills';

/**
 * Generates a data model and instantiates a Vue app at el
 * @param {HTMLElement} root
 */
export function vueify(root) {
  const data = {isMounted: false};

  performance.mark('press:vueify:createmodels:start');
  // Ensure all named elements have v-models so their contents are available to
  // the page model
  Array.from(root.querySelectorAll('[name]:not([v-model])')).forEach((el) => {
    if (!(el instanceof HTMLElement)) {
      throw new TypeNarrowingError();
    }

    const vModelName = normalizeKeyPath(vModelFromNode(el));
    el.setAttribute('v-model', vModelName);
  });
  performance.mark('press:vueify:createmodels:end');

  performance.mark('press:vueify:fixcheckboxes:start');
  fixCheckboxes(root);
  performance.mark('press:vueify:fixcheckboxes:end');

  performance.mark('press:vueify:generatemodel:start');
  Array.from(root.querySelectorAll('[v-model]')).forEach((el) => {
    if (!(el instanceof HTMLElement)) {
      throw new TypeNarrowingError();
    }
    generateModel(el, data);
  });
  performance.mark('press:vueify:generatemodel:start');
  root.setAttribute(':class', '{"press-mounted": isMounted}');

  /* eslint-disable sort-keys */
  new Vue({
    el: root,
    data,
    /** lifecycle hook */
    mounted() {
      // run on nextTick to avoid potentially showing templates before
      // initialization complete
      this.$nextTick(() => {
        this.isMounted = true;
      });
    }
  });
  /* eslint-enable sort-keys */
}

/**
 * Adds the specified element's v-model to the data model, if it has one.
 * @param {HTMLElement} el
 * @param {Object} data
 */
function generateModel(el, data) {
  const attributeNames = getAttributeNames(el);

  const vModelName = vModelFromNode(el);

  let defaultValue = null;
  switch (el.nodeName.toLowerCase()) {
    case 'select':
      {
        /** @type {HTMLOptionElement|null} */
        const option = el.querySelector('option[selected]');
        if (option) {
          defaultValue = option.value;
        }
      }
      break;
    case 'input':
      if (el.getAttribute('type') === 'checkbox') {
        if (!(el instanceof HTMLInputElement)) {
          throw new TypeNarrowingError();
        }
        defaultValue = el.checked;
      } else if (attributeNames.includes('value')) {
        defaultValue = el.getAttribute('value');
      }
      break;
    default:
      if (attributeNames.includes('value')) {
        defaultValue = el.getAttribute('value');
      }
  }

  touch(data, vModelName, defaultValue);
}

/**
 * Rails, for example, does some novel things to make checkboxes work. We need
 * to make sure PRESS doesn't break them.
 * @param {HTMLElement} root
 */
function fixCheckboxes(root) {
  Array.from(root.querySelectorAll('input[type="hidden"]')).forEach((el) => {
    if (!(el instanceof HTMLInputElement)) {
      throw new TypeNarrowingError();
    }

    const name = el.getAttribute('name');
    if (name) {
      const checkboxes = root.querySelectorAll(
        `input[type="checkbox"][name="${name}"]`
      );
      if (checkboxes.length) {
        el.removeAttribute('v-model');
      }
    }
  });
}
