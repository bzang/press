import Vue from 'vue';

import {touch} from './touch';
import {vModelFromNode, normalizeKeyPath} from './vue-helpers';
import {TypeNarrowingError} from './errors';

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
  const attributeNames = el.getAttributeNames();

  const vModelName = vModelFromNode(el);

  let defaultValue = null;
  if (el.nodeName.toLowerCase() === 'select') {
    /** @type {HTMLOptionElement|null} */
    const option = el.querySelector('option[selected]');
    if (option) {
      defaultValue = option.value;
    }
  } else if (attributeNames.includes('value')) {
    defaultValue = el.getAttribute('value');
  }
  touch(data, vModelName, defaultValue);
}
