import Vue from 'vue';
import autocomplete from './press-autocomplete.vue';
import {normalizeKeyPath, vModelFromNode} from '../../lib/vue-helpers';
import PressComponentBase from '../../press-component';

Vue.component('press-autocomplete', autocomplete);

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
  }
}
