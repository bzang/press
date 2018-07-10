Vue.component('ud-autocomplete', {
  inheritAttrs: false,
  data: function() {
    return {
      value: null,
      results: null
    };
  },
  methods: {
    fetchResults: function() {
      const results = new Array(10 - this.value.length);

      this.results = results
        .fill('')
        .map(function(_, index) {
          const arr = new Array(10 - index);
          arr.fill('a');
          console.log(arr);
          return arr.join('');
        })
        .reverse();
    }
  },
  template: document.getElementById('autocomplete').innerHTML
});

document.querySelectorAll('[data-ud-component]').forEach(function(el) {
  var attributeNames = el.getAttributeNames();
  // TODO polyfill Element#dataset
  console.log(el.dataset);
  var componentName = el.dataset.udComponent;

  var component = document.createElement(componentName);
  attributeNames.forEach(function(att) {
    if (att.startsWith('data-ud')) {
      return;
    }
    component.setAttribute(att, el.getAttribute(att));
  });

  // TODO polyfill replaceWith
  el.replaceWith(component);
});

document.querySelectorAll('form').forEach(function(form) {
  form.setAttribute('v-on:submit.prevent', 'validateBeforeSubmit');
  form.setAttribute('novalidate', true);
  form.setAttribute('v-bind:class', '{ mounted: isMounted }');

  var data = {
    isMounted: false
  };

  Array.from(form.querySelectorAll('input,select,textarea'))
    // The following is intentionally inefficient for demonstration purposes;
    // this should all be conbined into a single forEach should we go to
    // production.
    //
    // Skip inputs that don't have "name" attributes; they wouldn't be posted in
    // a non-javascript environment
    .filter(function(input) {
      if (input.getAttributeNames().includes('name')) {
        return true;
      }
      console.info('input does not include a name attibute; skipping');
    })
    // skip buttons
    .filter(function(input) {
      if (
        input.type.toLowerCase() !== 'submit' &&
        input.type.toLowerCase() !== 'reset'
      ) {
        return true;
      }
      console.info('input is a button; skipping');
    })
    .forEach(function(input) {
      var attributeNames = input.getAttributeNames();
      var name = input.getAttribute('name');

      // Find all the `v-model`s identified by this form. In general, there's no
      // need for the form to specify `v-model`, so we'll fallback to the common
      // case and set the `v-model` name to the input's `name`
      var vModelName;
      if (attributeNames.includes('v-model')) {
        vModelName = input.getAttribute('v-model');
      } else {
        vModelName = name;
        input.setAttribute('v-model', vModelName);
      }

      // If there isn't already an explicit validator in place, make sure we
      // infer whatever we can from html5 attributes
      if (!attributeNames.includes('v-validate')) {
        input.setAttribute('v-validate', '');
      }

      // Create a spot to put the element's error field
      // TODO avoid creating a second error node if we got one from the server
      var errorEl = document.createElement('div');
      errorEl.classList.add('error');
      errorEl.setAttribute('v-if', "errors.has('" + name + "')");
      errorEl.innerHTML = "{{ errors.first('" + name + "') }}";
      // Add a class to the node that'll hide it until Vue takes over the form
      errorEl.classList.add('hide-until-mount');
      input.after(errorEl);

      // make sure the data model that we pass to the Vue vaructor knows about
      // this element's model.
      var defaultValue = null;
      if (attributeNames.includes('value')) {
        defaultValue = input.getAttribute('value');
      }
      touch(data, vModelName, defaultValue);
    });

  new Vue({
    el: form,
    data: data,
    mounted: function() {
      // run on nextTick to avoid potentially showing the error divs before we
      // finish initializing
      this.$nextTick(
        function() {
          this.isMounted = true;
        }.bind(this)
      );
    },
    methods: {
      validateBeforeSubmit: function validateBeforeSubmit(event) {
        this.$validator.validateAll().then(function(result) {
          if (result) {
            // We're not pulling from this.data because we want to use the
            // original form field `name`s rather than the (potentially
            // nested) model paths.
            var submission = Array.from(
              event.target.querySelectorAll('input,select,textarea')
            ).reduce(function(acc, input) {
              acc[input.name] = input.value;
              return acc;
            }, {});

            repost(event.target.action, event.target.method, submission);
          }
        });
      }
    }
  });
});

// This is inefficient; we should use lodash.set (properly optimized) in
// production.
function touch(obj, path, value) {
  var keys = path.split('.');
  keys.forEach(function(key) {
    obj[key] = obj[key] || {};
  });
  obj[keys[keys.length - 1]] = value;
}

// We want to add client-side validation but still behave like a normal form
// post, so we'll copy the form data to a new form and submit it without the
// JavaScript interceptor.
function repost(action, method, data) {
  console.log(
    "Submitting formdata to '" + action + "' via '" + method + "'",
    data
  );
  var form = document.createElement('form');
  form.method = method;
  form.style.display = 'none';
  document.body.appendChild(form);
  form.action = action;
  Object.entries(data).forEach(function(entry) {
    var key = entry[0];
    var value = entry[1];
    var input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = value;
    form.appendChild(input);
  });
  form.submit();
}
