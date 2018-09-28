import Vue from 'vue';

import {normalizeKeyPath, vModelFromNode} from '../../lib/vue-helpers';
import PressComponentBase from '../../press-component';

import autocomplete from './press-autocomplete.vue';

Vue.component('press-autocomplete', autocomplete);

/**
 * press component for press-autocomplete tag
 */
export default class Autocomplete extends PressComponentBase {
  /** @returns {'autocomplete'} */
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
