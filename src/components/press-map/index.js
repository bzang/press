import Vue from 'vue';

import PressComponentBase from '../../press-component';

import map from './press-map.vue';

Vue.component('press-map', map);

/**
 * press component for press-map tag
 */
export default class Map extends PressComponentBase {
  /** @returns {'map'} */
  get name() {
    return 'map';
  }
}
