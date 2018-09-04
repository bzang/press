<template>
  <input
    :value="localeStringFromValue"
    data-press-datepicker-input>
</template>

<script>
import $ from 'jquery';
import 'daterangepicker';
import {
  shortMonthFormat,
  toDateRangePickerValue,
  toLocaleString
} from '../../lib/date';
import {get} from 'lodash';

export default {
  props: {
    value: {
      default: '',
      type: String
    }
  },
  data() {
    return {
      /** @type {JQuery<HTMLElement>|null} */
      $$el: null
    };
  },
  computed: {
    startDateFromValue() {
      return toDateRangePickerValue(get(this, 'value.start', undefined));
    },
    localeStringFromValue() {
      if (this.value) {
        return toLocaleString(this.value);
      }
    }
  },
  mounted() {
    const $$el = $(this.$el);
    this.$$el = $$el;

    $$el.daterangepicker(
      {
        singleDatePicker: true,
        startDate: this.startDateFromValue,
        locale: {
          format: shortMonthFormat
        }
      },
      (start) => {
        this.emit(start);
      }
    );

    const data = $$el.data('daterangepicker');
    if (data) {
      this.emit(data.startDate);
    }
  },
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
