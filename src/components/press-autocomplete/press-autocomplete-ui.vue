<template>
  <div class="ui input search">
    <input
      ref="input"
      :aria-owns="ariaComputedResultsId"
      :aria-expanded="showResultsList"
      :value="value"
      v-bind="$attrs"
      autocomplete="off"
      role="listbox"
      @click="onInputClick"
      @input="onInput"
      @focus="onFocus"
      @keyup="onKeyUp"
      @keydown="onKeyDown"
    >
    <div
      :class="{visible: showResultsList}"
      :id="ariaComputedResultsId"
      class="results transition">
      <template v-if="results && results.length === 0">
        <div class="message empty">
          <div class="header">No Results</div>
          <div class="description">Your search returned no results</div>
        </div>
      </template>
      <template v-if="results && results.length > 0">
        <a
          v-for="(result, index) in results"
          :key="result"
          :ref="index"
          class="result"
          role="option"
          tabindex="0"
          @click="chooseValueFromList(result)"
          @keydown.prevent="onListItemKeyDown">
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

import {keyName} from '../../lib/keys';
/* eslint-disable sort-keys */
/**
 * Inner component used by autocomplete for renderign UI.
 */
export default {
  inheritAttrs: false,
  props: {
    results: {
      /** @returns {null} */
      default() {
        return null;
      },
      type: Array
    },
    initialValue: {
      /** @returns {string} */
      default() {
        return '';
      },
      type: String
    }
  },
  /** @returns {Object} */
  data() {
    return {
      ariaResultsId: uuid().replace(/-/g, '_'),
      interactive: false,
      nextValue: '',
      selected: null,
      value: this.initialValue,
      lastUserInput: ''
    };
  },
  computed: {
    /** @returns {boolean} */
    showResultsList() {
      return (
        this.interactive &&
        this.value &&
        this.value.length > 0 &&
        !!this.results
      );
    },
    /** @returns {string|undefined} */
    ariaComputedResultsId() {
      if (this.showResultsList) {
        return this.ariaResultsId;
      }
    }
  },
  watch: {
    /** updates value if initialValue changes */
    initialValue() {
      this.value = this.initialValue;
    },
    /**
     * moves focus if selected moves outsides the range of values
     * @param {number} current
     * @param {number} previous
     */
    selected(current, previous) {
      if (current !== null) {
        this.value = this.results[current];
        const next = this.$refs[current];
        if (Array.isArray(next)) {
          if (next[0]) {
            next[0].focus();
          }
        } else {
          next.focus();
        }
        if (previous === null) {
          this.lastUserInput = this.value;
        }
      } else {
        this.value = this.lastUserInput;
      }
    }
  },
  methods: {
    /** @param {string} value */
    chooseValue(value) {
      this.value = value;
      this.lastUserInput = value;
      this.$emit('choose', value);
      this.selected = null;
      this.focusInputWithoutMenu();
    },
    /** sets value based on current input */
    chooseValueFromInput() {
      this.chooseValue(this.value);
    },
    /** @param {string} value */
    chooseValueFromList(value) {
      this.chooseValue(value);
    },
    /** focuses the input box */
    focusInput() {
      this.$refs.input.focus();
      this.selected = null;
    },
    /** focus the input without opening the drop list */
    focusInputWithoutMenu() {
      this.$refs.input.focus();
      this.selected = null;
      this.interactive = false;
    },
    /** event handler */
    onFocus() {
      this.interactive = true;
      this.selected = null;
    },
    /**
     * event handler
     * @param {Event} event
     */
    onInput(event) {
      this.value = event.target.value;
      this.nextValue = '';
    },
    /** event handler */
    onInputClick() {
      this.interactive = true;
    },
    /**
     * event handler
     * @param {Event} event
     */
    onListItemKeyDown(event) {
      switch (keyName(event, true)) {
        case 'Tab':
          this.chooseValueFromInput();
          break;
        case 'ArrowUp':
          this.selectPreviousItem();
          break;
        case 'ArrowDown':
          this.selectNextItem();
          break;
        case 'Return':
        case 'Enter':
          this.chooseValueFromInput();
          break;
      }
    },
    /**
     * event handler
     * @param {Event} event
     */
    onKeyDown(event) {
      switch (keyName(event, true)) {
        case 'Tab':
          this.chooseValueFromInput();
          return;
        case 'ArrowDown':
          this.selected = 0;
          this.interactive = true;
          return;
      }
    },
    /**
     * event handler
     * @param {Event} event
     */
    onKeyUp(event) {
      this.$emit('type', event.target.value);
    },
    /** selects the next item in results */
    selectNextItem() {
      if (this.results && this.selected + 1 < this.results.length) {
        this.selected += 1;
      }
    },
    /** selects the previous item in results */
    selectPreviousItem() {
      if (this.selected === 0) {
        this.selected = null;
      } else {
        this.selected -= 1;
      }
    }
  }
};
/* eslint-enable sort-keys */
</script>
