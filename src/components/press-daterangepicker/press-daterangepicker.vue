<template>
  <input
    :value="localeStringeFromValue"
    data-press-daterangepicker-input
  >
</template>

<script>
import $ from 'jquery';
import 'daterangepicker';
import {get} from 'lodash';

import {
  dateSeparator,
  defaultTextSeparator,
  locale,
  toDateRangePickerValue,
  toLocaleString
} from '../../lib/date';

export default {
  props: {
    startKey: {
      default: 'start',
      type: String
    },
    endKey: {
      default: 'end',
      type: String
    },
    parentSelector: {
      default: '',
      type: String
    },
    value: {
      default() {
        return {
          [this.startKey]: undefined,
          [this.endKey]: undefined
        };
      },
      type: Object
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
      return toDateRangePickerValue(
        get(this, `value.${this.startKey}`, undefined)
      );
    },
    endDateFromValue() {
      return toDateRangePickerValue(
        get(this, `value.${this.endKey}`, undefined)
      );
    },
    start() {
      if (this.value && this.value[this.startKey]) {
        return this.value[this.startKey];
      }
    },
    end() {
      if (this.value && this.value[this.endKey]) {
        return this.value[this.endKey];
      }
    },
    localeStringeFromValue() {
      if (this.start && this.end) {
        return `${toLocaleString(this.start)}${dateSeparator}${toLocaleString(
          this.end
        )}`;
      }
    }
  },
  mounted() {
    const $$el = $(this.$el);
    this.$$el = $$el;
    this.$$el.on('hide.daterangepicker', () => {
      this.clearDate();
    });
    $$el.daterangepicker(
      {
        autoApply: true,
        startDate: this.startDateFromValue,
        endDate: this.endDateFromValue,
        minDate: toDateRangePickerValue(new Date()),
        parentEl: this.parentSelector,
        locale
      },
      (start, end) => {
        this.emit(start, end);
      }
    );
    if (this.start === this.end) {
      this.$nextTick().then(this.setDefaultText);
    }
    if (this.start === undefined || this.end === undefined) {
      this.$nextTick().then(this.setDefaultText);
    }

    const data = $$el.data('daterangepicker');
    if (data) {
      this.emit(data.startDate, data.endDate);
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
     * @param {moment.Moment} end
     */
    emit(start, end) {
      if (start.isSame(end, 'day')) {
        this.$nextTick().then(this.setDefaultText);
      }
      this.$emit('input', {
        [this.startKey]: start.format('YYYY-MM-DD'),
        [this.endKey]: end.format('YYYY-MM-DD')
      });
    },
    clearDate() {
      if (this.start === this.end) {
        this.setDefaultText();
      }
    },
    setDefaultText() {
      this.$$el.val(`Arrive${defaultTextSeparator}Depart`);
    }
  }
};
</script>

<style>
@import 'daterangepicker';
</style>

<style scoped>
</style>
