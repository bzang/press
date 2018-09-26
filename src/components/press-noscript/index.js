import Vue from 'vue';
import noscript from './press-noscript.vue';
import PressComponentBase from '../../press-component';

Vue.component('press-noscript', noscript);

export default class Noscript extends PressComponentBase {
  get name() {
    return 'noscript';
  }

  enhance() {
    // noop
  }
}
