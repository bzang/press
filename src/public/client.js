/**
 * selects any non-button, named input, named, select box, or named text area.
 */
var inputSelector =
  'input[name]:not([type="reset"]):not([type="submit"]),select[name],textarea[name]';

var appSelector = 'form';

// TODO polyfill WeakMap
/** Holds our data models between phases. Ideally a weak map. */
var models = new WeakMap();

document.querySelectorAll(inputSelector).forEach(annotateInputs);
document.querySelectorAll(appSelector).forEach(constructDataModels);
document.querySelectorAll(appSelector).forEach(instantiateApps);

/**
 * Decorates the specified input (or input-like) html element with Vue
 * attributes
 * @param {HTMLElement} input
 */
function annotateInputs(input) {
  var attributeNames = input.getAttributeNames();
  var name = input.getAttribute('name');

  var vModelName;
  if (attributeNames.includes('v-model')) {
    vModelName = input.getAttribute('v-model');
  } else {
    vModelName = name;
    input.setAttribute('v-model', vModelName);
  }

  // Ensure v-validate processes every element
  if (!attributeNames.includes('v-validate')) {
    input.setAttribute('v-validate', '');
  }

  // TODO error nodes should be supplied from the server, but we're going to
  // skip that until we do the integration with simpleform
  input.after(makeErrorNode(name));
}

function constructDataModels(el) {
  var data = {};
  Array.from(el.querySelectorAll('[v-model]')).forEach(function(input) {
    var attributeNames = input.getAttributeNames();

    var vModelName = input.getAttribute('v-model');

    var defaultValue = null;
    if (attributeNames.includes('value')) {
      defaultValue = input.getAttribute('value');
    }
    touch(data, vModelName, defaultValue);
  });
  models.set(el, data);
}

function instantiateApps(el) {
  var data = models.get(el);

  new Vue({
    el: el,
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
}

/**
 * Temporary; this should be done from the server
 * @param {string} name
 * @returns {HTMLDivElement}
 */
function makeErrorNode(name) {
  // Create a spot to put the element's error field
  var errorEl = document.createElement('div');
  errorEl.classList.add('error');
  errorEl.setAttribute('v-if', "errors.has('" + name + "')");
  errorEl.innerHTML = "{{ errors.first('" + name + "') }}";
  // Add a class to the node that'll hide it until Vue takes over the form
  errorEl.classList.add('hide-until-mount');
  return errorEl;
}

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
