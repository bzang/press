import Vue from 'vue';
import {touch} from './touch';
import {vModelFromNode} from './vue-helpers';
import {TypeNarrowingError} from './errors';

/**
 * Generates a data model and instantiates a Vue app at el
 * @param {HTMLElement} root
 */
export function vueify(root) {
  const data = {
    isMounted: false
  };

  Array.from(root.querySelectorAll('[v-model]')).forEach((el) => {
    if (!(el instanceof HTMLElement)) {
      throw new TypeNarrowingError();
    }
    generateModel(el, data);
  });
  root.setAttribute(':class', '{"press-mounted": isMounted}');

  new Vue({
    el: root,
    data,
    mounted() {
      // run on nextTick to avoid potentially showing templates before
      // initialization complete
      this.$nextTick(() => {
        this.isMounted = true;
      });
    }
  });
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
