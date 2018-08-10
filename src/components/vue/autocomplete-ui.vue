<template>
  <div class="ui search">
    <input
      ref="input"
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
          v-for="(result, index) in results"
          :key="result"
          :ref="index"
          class="result"
          role="option"
          tabindex="0"
          @click="chooseValueFromList(result)"
          @keydown="onListItemKeyDown">
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
import {keyName} from './keys';

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
      selected: null,
      value: this.initialValue,
      lastUserInput: ''
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
    },
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
    chooseValue(value) {
      this.value = value;
      this.lastUserInput = value;
      this.$emit('choose', value);
      this.focused = false;
      this.selected = null;
    },
    chooseValueFromInput() {
      this.chooseValue(this.value);
    },
    chooseValueFromList(value) {
      this.chooseValue(value);
    },
    focusInput() {
      this.$refs.input.focus();
      this.selected = null;
    },
    onFocus() {
      this.focused = true;
      this.selected = null;
    },
    onInput(event) {
      this.value = event.target.value;
      this.nextValue = '';
    },
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
        case 'Enter':
          this.chooseValueFromInput();
          break;
      }
    },
    onKeyDown(event) {
      switch (keyName(event, true)) {
        case 'Tab':
          this.chooseValueFromInput();
          return;
        case 'ArrowDown':
          this.selected = 0;
          return;
      }
    },
    onKeyUp(event) {
      this.$emit('type', event.target.value);
    },
    selectNextItem() {
      if (this.selected + 1 < this.results.length) {
        this.selected += 1;
      }
    },
    selectPreviousItem() {
      if (this.selected === 0) {
        this.selected = null;
      } else {
        this.selected -= 1;
      }
    }
  }
};
</script>
