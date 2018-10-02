import Vue from 'vue';

import PressComponentBase from '../../press-component';

import staticValue from './press-static-value.vue';

Vue.component('press-static-value', staticValue);

/**
 * press component for press-static-value tag
 */
export default class PressStaticValue extends PressComponentBase {
  /** @returns {'static-value'} */
  get name() {
    return 'static-value';
  }

  /** */
  enhance() {}
}
