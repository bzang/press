<template>
  <input
    :value="localeStringFromValue"
    :placeholder="placeholder">
</template>

<script>
import $ from 'jquery';
import 'daterangepicker';
import {get} from 'lodash';

import {locale, toDateRangePickerValue, toLocaleString} from '../../lib/date';

/* eslint-disable sort-keys */
/**
 * Single value date picker
 */
export default {
  props: {
    placeholder: {
      default: '',
      type: String
    },
    /**
     * @model
     */
    value: {
      default: '',
      type: String
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
      return toDateRangePickerValue(get(this, 'value.start', undefined));
    },
    /** @returns {string|undefined} */
    localeStringFromValue() {
      if (this.value) {
        return toLocaleString(this.value);
      }
    }
  },
  /** lifecycle method */
  mounted() {
    const $$el = $(this.$el);
    this.$$el = $$el;

    $$el.daterangepicker(
      {
        singleDatePicker: true,
        startDate: this.startDateFromValue,
        locale
      },
      (start) => {
        this.emit(start);
      }
    );

    // eslint-disable-next-line jquery/no-data
    const data = $$el.data('daterangepicker');
    if (data) {
      this.emit(data.startDate);
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
     */
    emit(start) {
      this.$emit('input', start.format('YYYY-MM-DD'));
    }
  }
};
/* eslint-enable sort-keys */
</script>

<style>
@import 'daterangepicker';
</style>
