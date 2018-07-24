<template>
  <input
    :value="localeStringFromValue"
    data-press-datepicker-input>
</template>

<script>
import $ from 'jquery';
import 'daterangepicker';
import moment from 'moment';

export default {
  props: {
    value: {
      default: '',
      type: String
    }
  },
  data() {
    return {$$el: null};
  },
  computed: {
    startDateFromValue() {
      if (this.value) {
        return moment(this.value)
          .startOf('day')
          .toDate();
      }
    },
    localeStringFromValue() {
      if (this.value) {
        return moment(this.value)
          .startOf('day')
          .format('L');
      }
    }
  },
  mounted() {
    this.$$el = $(this.$el);
    this.$$el.daterangepicker(
      {
        singleDatePicker: true,
        startDate: this.startDateFromValue
      },
      (start) => {
        this.$emit('input', start.format('YYYY-MM-DD'));
      }
    );
  },
  beforeDestroy() {
    this.$$el.daterangepicker('hide').daterangepicker('destroy');
  }
};
</script>

<style>
@import 'daterangepicker';
</style>
