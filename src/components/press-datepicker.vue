<template>
  <input data-press-datepicker-input>
</template>

<script>
import $ from 'jquery';
import 'daterangepicker';
import moment from 'moment';

export default {
  mounted() {
    $(this.$el).daterangepicker(
      {
        singleDatePicker: true,
        startDate: this.startDateFromValue
      },
      (start, end, label) => {

        // const offset = start.utcOffset() - moment().utcOffset()
        // start.subtract(offset, 'minutes')

        this.$emit('input', start.format('YYYY-MM-DD'));
      }
    );
  },
  beforeDestroy: function() {
    $(this.$el)
      .datepicker('hide')
      .datepicker('destroy');
  },
  computed: {
    startDateFromValue() {
      if (this.value) {
        return moment(this.value).toDate();
      }
    }
  },
  props: ['value'],
  watch: {
    /**
     * Ensures the input daterangepicker is updated if the `value` is changed
     * externally.
     * @param {Date} oldValue
     * @param {Date} newValue
     */
    startDateFromValue(oldValue, newValue) {
      $(this.$el)
        .data('daterangepicker')
        .setStartDate(newValue);
    }
  }
};
</script>

<style>
@import 'daterangepicker';
</style>
