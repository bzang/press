import Vue from 'vue';

import PressComponentBase from '../../press-component';

import noscript from './press-noscript.vue';

Vue.component('press-noscript', noscript);

/**
 * press component for press-noscript tag
 */
export default class Noscript extends PressComponentBase {
  /** @returns {'noscript'} */
  get name() {
    return 'noscript';
  }

  /** noop */
  enhance() {
    // noop
  }
}
