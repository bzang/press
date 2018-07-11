if (document.getElementById('ud-component-daterangepicker-template')) {
  Vue.component('press-daterangepicker', {
    inheritAttrs: false,
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
    methods: {
      emit: function() {
        this.$emit('input', {
          start: this.start,
          end: this.end
        });
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
