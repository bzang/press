<template>
  <input
    v-once
    :name="name"
    :value="localeStringeFromValue"
    data-press-daterangepicker-input
  >
</template>

<script>
import $ from 'jquery';
import 'daterangepicker';
import {get} from 'lodash';
import * as moment from 'moment';

import {
  dateSeparator,
  defaultTextSeparator,
  locale,
  toDateRangePickerValue,
  toLocaleString
} from '../../lib/date';
/* eslint-disable sort-keys */
/**
 * Multi-value date range picker
 */
export default {
  props: {
    /**
     * When supplied, will be treated as a common key path for startKey and
     * endKey. If no name is specified, the value and input events will emit
     * objects like `{[startKey]: '...', [endKey]: '...'}`; when name is supplied, the
     * object will look like `{[name]: {[startKey]: '...', [endKey]: '...'}}`
     */
    name: {
      default: '',
      type: String
    },
    /** The start date portion of the object bound to v-model */
    pressEndKey: {
      default: 'end',
      type: String
    },
    /**
     * Passed through to the [daterangepicker.com](daterangepicker.com) jQuery
     * plugin
     */
    pressParentSelector: {
      default: '',
      type: String
    },
    /** The start date portion of the object bound to v-model */
    pressStartKey: {
      default: 'start',
      type: String
    },
    /**
     * @model
     */
    value: {
      /**
       * @returns {Object}
       */
      default() {
        return {
          [this.pressStartKey]: undefined,
          [this.pressEndKey]: undefined
        };
      },
      type: Object
    }
  },
  /**
   * @returns {Object}
   */
  data() {
    return {
      /** @type {JQuery<HTMLElement>|null} */
      $$el: null
    };
  },
  computed: {
    /** @returns {Date|undefined} */
    startDateFromValue() {
      return toDateRangePickerValue(
        get(this, `value.${this.pressStartKey}`, undefined)
      );
    },
    /** @returns {Date|undefined} */
    endDateFromValue() {
      return toDateRangePickerValue(
        get(this, `value.${this.pressEndKey}`, undefined)
      );
    },
    /** @returns {string|undefined} */
    start() {
      if (this.value && this.value[this.pressStartKey]) {
        return this.value[this.pressStartKey];
      }
    },
    /** @returns {string|undefined} */
    end() {
      if (this.value && this.value[this.pressEndKey]) {
        return this.value[this.pressEndKey];
      }
    },
    /** @returns {string|undefined} */
    localeStringeFromValue() {
      if (this.start && this.end) {
        return `${toLocaleString(this.start)}${dateSeparator}${toLocaleString(
          this.end
        )}`;
      }
    }
  },
  watch: {
    /** triggers update() when end changes */
    end() {
      this.update();
    },
    /** triggers update() when start changes */
    start() {
      this.update();
    }
  },
  /** lifecycle method */
  mounted() {
    this.$$el = $(this.$el);
    this.$$el.daterangepicker(
      {
        autoApply: true,
        startDate: this.startDateFromValue,
        endDate: this.endDateFromValue,
        minDate: toDateRangePickerValue(new Date()),
        parentEl: this.pressParentSelector,
        locale
      },
      (start, end) => {
        this.emit(start, end);
      }
    );
    // eslint-disable-next-line jquery/no-data
    const data = this.$$el.data('daterangepicker');
    if (data) {
      this.emit(data.startDate, data.endDate);
    }
  },
  /** lifecycle method */
  beforeDestroy() {
    const {$$el} = this;
    if ($$el) {
      $$el.daterangepicker('hide');
      $$el.daterangepicker('destroy');
    }
  },
  methods: {
    /**
     * @param {moment.Moment} start
     * @param {moment.Moment} end
     */
    emit(start, end) {
      this.$emit('input', {
        [this.pressStartKey]: start.format('YYYY-MM-DD'),
        [this.pressEndKey]: end.format('YYYY-MM-DD')
      });
    },
    /**
     * Checks if the current date should be replace with Arrive -> Depart and
     * does so when appropriat
     */
    update() {
      if (this.start === this.end) {
        this.setDefaultText();
      } else if (this.start === undefined || this.end === undefined) {
        this.setDefaultText();
      } else if (
        // eslint-disable-next-line import/namespace
        moment.isMoment(this.start) &&
        // eslint-disable-next-line import/namespace
        moment.isMoment(this.end) &&
        this.start.isSame(this.end, 'day')
      ) {
        this.setDefaultText();
      } else {
        const localeString = this.localeStringeFromValue;
        if (localeString) {
          if (!this.$$el) {
            throw new TypeError('Somehow, $$el became undefined');
          }
          this.$$el.val(localeString);
        }
      }
    },
    /**
     * Sets the input's value to Arrive -> Depart without emitting an input
     * event
     */
    setDefaultText() {
      if (!this.$$el) {
        throw new TypeError('Somehow, $$el became undefined');
      }
      this.$$el.val(`Arrive${defaultTextSeparator}Depart`);
    }
  }
};
/* eslint-enable sort-keys */
</script>

<style>
@import 'daterangepicker';
</style>

<style scoped>
</style>
