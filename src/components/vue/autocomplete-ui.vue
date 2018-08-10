<template>
  <div class="ui search">
    <input
      :aria-owns="ariaResultsId"
      :aria-expanded="showResultsList"
      :value="value"
      v-bind="$attrs"
      autocomplete="off"
      @input="onInput"
      @focus="onFocus"
      @keyup="onKeyUp"
      @keydown="onKeyDown"
    >
    <div
      :class="{visible: showResultsList}"
      class="results transition"
      role="listbox">
      <template v-if="results && results.length === 0">
        <div class="message empty">
          <div class="header">No Results</div>
          <div class="description">Your search returned no results</div>
        </div>
      </template>
      <template v-if="results && results.length > 0">
        <a
          v-for="result in results"
          :key="result"
          class="result"
          role="option"
          tabindex="0"
          @click="chooseValueFromList(result)">
          <div class="content">
            <div class="title">{{ result }}</div>
          </div>
        </a>
      </template>
    </div>
  </div>
</template>

<script>
import {v4 as uuid} from 'uuid';

export default {
  inheritAttrs: false,
  props: {
    results: {
      default() {
        return null;
      },
      type: Array
    },
    initialValue: {
      default() {
        return '';
      },
      type: String
    }
  },
  data() {
    return {
      ariaResultsId: uuid().replace(/-/g, '_'),
      focused: false,
      nextValue: '',
      value: this.initialValue
    };
  },
  computed: {
    showResultsList() {
      return (
        this.focused && this.value && this.value.length > 0 && !!this.results
      );
    }
  },
  watch: {
    initialValue() {
      this.value = this.initialValue;
    }
  },
  methods: {
    onInput(event) {
      this.value = event.target.value;
      this.nextValue = '';
    },
    onFocus() {
      this.focused = true;
    },
    onKeyDown(event) {
      if (isTab(event)) {
        this.chooseValueFromInput(this.value);
      }
    },
    onKeyUp(event) {
      this.$emit('type', event.target.value);
    },
    chooseValue(value) {
      this.value = value;
      this.$emit('choose', value);
      this.focused = false;
    },
    chooseValueFromInput(value) {
      this.chooseValue(value);
    },
    chooseValueFromList(value) {
      this.chooseValue(value);
    }
  }
};
function isTab(event) {
  if (event.code && event.code === 'Tab') {
    return true;
  }

  if (String.fromCharCode(event.keyCode) === '\t') {
    return true;
  }

  return false;
}
</script>
