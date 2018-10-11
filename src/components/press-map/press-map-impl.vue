<template>
  <div
    v-once
    ref="map"
  ><slot/></div>
</template>

<script>
export default {
  props: {
    /** @type {google.maps.LatLngLiteral} */
    center: {
      required: true,
      type: Object
    },
    google: {
      default: null,
      type: Object
    },
    zoom: {
      required: true,
      type: Number
    }
  },
  /** @returns {{map: google.maps.Map}} */
  data() {
    return {
      /** @type {google.maps.Map|null} */
      map: null
    };
  },
  watch: {
    /** watcher */
    google() {
      if (this.google && !this.map) {
        this.map = new google.maps.Map(this.$refs.map, {
          center: this.center,
          zoomControl: true,
          zoomControlOptions: {
            position: google.maps.ControlPosition.TOP_RIGHT
          },
          mapTypeControl: false,
          scaleControl: false,
          streetViewControl: false,
          rotateControl: false,
          fullscreenControl: true,
          fullscreenControlOptions: {
            position: google.maps.ControlPosition.RIGHT_TOP
          },
          zoom: this.zoom
        });
      }
    }
  }
};
</script>
