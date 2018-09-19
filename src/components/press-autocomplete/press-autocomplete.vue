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

/**
 * Input element that renders server-provided typeahead results.
 */
export default {
  components: {
    'press-autocomplete-ui': AutocompleteUI
  },
  inheritAttrs: false,
  props: {
    /**
     * If your API cannot be customized and/or sends back more complex objects,
     * you may provided an [`_.get`](https://lodash.com/docs/4.17.10#get)
     * compatible keypath for extracting label values. Use `'.'` for an array of
     * strings.
     */
    labelPath: {
      default() {
        return 'label';
      },
      type: String
    },
    /**
     * Indicates the HTTP verb used to reach your autocomplete API
     */
    method: {
      default() {
        return 'GET';
      },
      type: String
    },
    /**
     * querystring parameter in which the server expects to find the search
     * string.
     */
    param: {
      default() {
        return 'q';
      },
      type: String
    },
    /**
     * API route that receives the autocomplete request.
     */
    route: {
      default() {
        return window.location.pathname;
      },
      type: String
    },
    /**
     * @model
     */
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
