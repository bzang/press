import Vue from 'vue';
import {touch} from './touch';

/**
 * Generates a data model and instantiates a Vue app at el
 * @param {HTMLElement} el
 */
export function vueify(el) {
  const data = {
    isMounted: false
  };

  generateModel(el, data);
  Array.from(el.querySelectorAll('[v-model]')).forEach((el) => {
    if (!(el instanceof HTMLElement)) {
      return;
    }
    generateModel(el, data);
  });
  el.setAttribute(':class', '{"press-mounted": isMounted}');

  new Vue({
    el,
    data,
    mounted() {
      // run on nextTick to avoid potentially showing the error divs before we
      // finish initializing
      this.$nextTick(() => {
        this.isMounted = true;
      });
    }
  });
}

/**
 * Adds the specified element's v-model to the data mode, if it has one.
 * @param {HTMLElement} el
 * @param {Object} data
 */
function generateModel(el, data) {
  const attributeNames = el.getAttributeNames();

  const vModelName = el.getAttribute('v-model');

  let defaultValue = null;
  if (el.nodeName.toLowerCase() === 'select') {
    /** @type {HTMLOptionElement} */
    const option = el.querySelector('option[selected]');
    defaultValue = option.value;
  } else if (attributeNames.includes('value')) {
    defaultValue = el.getAttribute('value');
  }
  touch(data, vModelName, defaultValue);
}
