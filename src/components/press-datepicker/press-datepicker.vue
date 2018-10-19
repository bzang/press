<template>
  <div>
    <input
      ref="input"
      :value="localeStringFromValue"
      :placeholder="placeholder"
      :required="required"
    >
    <div
      v-if="pressValidationError"
      class="ui error input"
    >
      {{ pressValidationError }}
    </div>
  </div>
</template>

<script>
import $ from 'jquery';
import 'daterangepicker';
import {get} from 'lodash';

import {locale, toDateRangePickerValue, toLocaleString} from '../../lib/date';

/**
 * Single value date picker
 */
export default {
  props: {
    placeholder: {
      default: '',
      type: String
    },
    pressValidationError: {
      default: '',
      type: String
    },
    required: {
      default: false,
      type: Boolean
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
    const $$el = $(this.$refs.input);
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
</script>

<style>
@import 'daterangepicker';
</style>
