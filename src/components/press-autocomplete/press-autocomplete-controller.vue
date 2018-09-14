<template>
  <press-autocomplete-ui
    v-bind="$attrs"
    :initial-value="value"
    :results="results"
    @choose="onChoose"
    @type="onType"
  />
</template>

<script>
import {fetchResults} from './press-autocomplete-api.js';
import AutocompleteUI from './press-autocomplete-ui.vue';

export default {
  components: {
    'press-autocomplete-ui': AutocompleteUI
  },
  inheritAttrs: false,
  props: {
    labelPath: {
      default() {
        return 'label';
      },
      type: String
    },
    method: {
      default() {
        return 'GET';
      },
      type: String
    },
    param: {
      default() {
        return 'q';
      },
      type: String
    },
    route: {
      default() {
        return window.location.pathname;
      },
      type: String
    },
    value: {
      default() {
        return '';
      },
      type: String
    }
  },
  data() {
    return {
      /** @type {string[] | null} */
      results: null
    };
  },
  methods: {
    onChoose(value) {
      this.$emit('input', value);
      this.results = null;
    },
    onType(value) {
      if (!value) {
        this.results = null;
        return;
      }

      fetchResults(this.route, value, {
        keyPath: this.labelPath,
        method: this.method,
        param: this.param
      }).then((res) => {
        this.results = res;
      });
    }
  }
};
</script>
