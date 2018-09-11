import Vue from 'vue';
import autocomplete from './autocomplete-controller.vue';
import {normalizeKeyPath, vModelFromNode} from '../../lib/vue-helpers';
import PressComponentBase from '../../press-component';

Vue.component('autocomplete', autocomplete);

export default class Autocomplete extends PressComponentBase {
  get name() {
    return 'autocomplete';
  }

  /**
   * @param {HTMLElement} el
   */
  enhance(el) {
    const vModelName = normalizeKeyPath(vModelFromNode(el));
    el.setAttribute('v-model', vModelName);

    const component = document.createElement('autocomplete');
    const attrNames = el.getAttributeNames();
    for (const attrName of attrNames) {
      const value = el.getAttribute(attrName) || '';

      if (attrName === 'data-press-component') {
        continue;
      }
      if (attrName.startsWith('data-press')) {
        component.setAttribute(attrName.replace('data-press-', ''), value);
      } else {
        component.setAttribute(attrName, value);
      }
    }

    el.setAttribute('v-if', 'false');
    component.setAttribute('v-model', vModelName);

    el.after(component);
  }
}
