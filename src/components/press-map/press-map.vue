<template>
  <div class="fit-container">
    <map-impl
      :center="center"
      :google="google"
      :zoom="zoom"
      class="fit-container no-overflow"
    ><slot/></map-impl>
  </div>
</template>

<script>
import {v4} from 'uuid';

import {addRemoteScriptToPage} from '../../lib/html';

import MapImpl from './press-map-impl.vue';

let fetchingGoogleMapsScript = false;
let fetchedGoogleMapsScript = false;
const pressMapInstances = new Set();

/**
 * Map controller
 */
export default {
  components: {
    mapImpl: MapImpl
  },
  props: {
    pressCenterLat: {
      required: true,
      type: String
    },
    pressCenterLng: {
      required: true,
      type: String
    },
    pressKey: {
      required: true,
      type: String
    },
    pressZoom: {
      required: true,
      type: String
    }
  },
  /** @returns {Object} */
  data() {
    return {
      google: null,
      mapsIsLoaded: false
    };
  },
  computed: {
    /**
     * @returns {{lat: number, lng: number}}
     */
    center() {
      return {
        lat: Number(this.pressCenterLat),
        lng: Number(this.pressCenterLng)
      };
    },
    /**
     * @returns {number}
     */
    zoom() {
      return Number(this.pressZoom);
    }
  },
  /** lifecycle method */
  beforeMount() {
    if (fetchedGoogleMapsScript) {
      this.mapsIsLoaded = true;
    } else if (fetchingGoogleMapsScript) {
      pressMapInstances.add(this);
    } else {
      fetchingGoogleMapsScript = true;
      pressMapInstances.add(this);
      const funcName = `initMap${v4()}`.replace(/-/g, '_');

      // @ts-ignore
      window[funcName] = () => {
        // @ts-ignore
        window[funcName] = undefined;
        Array.from(pressMapInstances).forEach((v) => {
          v.mapsIsLoaded = true;
          // @ts-ignore
          v.google = google;
        });
        fetchingGoogleMapsScript = false;
        fetchedGoogleMapsScript = true;
      };

      addRemoteScriptToPage(
        `https://maps.googleapis.com/maps/api/js?key=${
          this.pressKey
        }&callback=${funcName}`
      );
    }
  },
  /** lifecycle method */
  destroyed() {
    pressMapInstances.delete(this);
  }
};
</script>

<style scoped>
.fit-container {
  height: 100%;
  width: 100%;
}

.no-overflow {
  max-width: 100%;
  max-height: 100%;
  overflow: hidden;
}
</style>
