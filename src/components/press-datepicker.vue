<template>
  <input data-press="true">
</template>

<script>
import $ from 'jquery';
import 'daterangepicker';

export default {
  mounted() {
    $(this.$el).daterangepicker(
      {
        singleDatePicker: true,
        startDate: this.startDateFromValue
      },
      (start, end, label) => {
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
        return new Date(this.value);
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
