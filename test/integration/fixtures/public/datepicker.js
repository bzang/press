if (document.getElementById('ud-component-daterangepicker-template')) {
  Vue.component('press-daterangepicker', {
    props: {
      value: {
        default() {
          return {
            start: null,
            end: null
          };
        },
        type: Object
      },
      submitAs: {
        default() {
          return {
            start: 'start_date',
            end: 'end_date'
          };
        },
        type: Object
      }
    },
    data() {
      return {
        start: null,
        end: null
      };
    },
    computed: {
      startDate() {
        if (!this.start) {
          return null;
        }

        return this.start.toISOString().replace(/T.+$/, '');
      },
      endDate() {
        if (!this.end) {
          return null;
        }

        return this.end.toISOString().replace(/T.+$/, '');
      }
    },
    methods: {
      emit() {
        this.$emit('input', {
          start: this.startDate,
          end: this.endDate
        });
      },
      onFocus() {
        this.refs.datepicker.showDatepicker();
      },
      onCheckinChanged(newDate) {
        this.start = newDate;
        this.emit();
      },
      onCheckoutChanged(newDate) {
        this.end = newDate;
        this.emit();
      }
    },
    template: document.getElementById('ud-component-daterangepicker-template')
      .innerHTML
  });
}
