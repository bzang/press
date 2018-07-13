if (document.getElementById('ud-component-daterangepicker-template')) {
  Vue.component('press-daterangepicker', {
    props: {
      value: {
        default: function() {
          return {
            start: null,
            end: null
          };
        },
        type: Object
      },
      submitAs: {
        default: function() {
          return {
            start: 'start_date',
            end: 'end_date'
          };
        },
        type: Object
      }
    },
    data: function() {
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
      emit: function() {
        this.$emit('input', {
          start: this.startDate,
          end: this.endDate
        });
      },
      onFocus: function() {
        this.refs.datepicker.showDatepicker();
      },
      onCheckinChanged: function(newDate) {
        this.start = newDate;
        this.emit();
      },
      onCheckoutChanged: function(newDate) {
        this.end = newDate;
        this.emit();
      }
    },
    template: document.getElementById('ud-component-daterangepicker-template')
      .innerHTML
  });
}
