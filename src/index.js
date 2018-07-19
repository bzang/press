import {has, set} from 'lodash';
import Vue from 'vue';
import VeeValidate from 'vee-validate';

import {annotate as annotateInputs} from './form';

Vue.use(VeeValidate);

/**
 * selects any non-button, named input, named select box, or named textarea.
 */
const inputSelector =
  'input[name]:not([type="reset"]):not([type="submit"]),select[name],textarea[name]';

// TODO instead, search for [data-press-app] and use its value to determine if
// we shoud init as a form or something else; use js to add
// [data-press-app=form] to all form elements.
const appSelector = 'form';

/** Holds our data models between phases. */
const models = new WeakMap();

document.querySelectorAll(inputSelector).forEach(annotateInputs);
// TODO replace data-press-components
document.querySelectorAll(appSelector).forEach(constructDataModels);
document.querySelectorAll(appSelector).forEach(instantiateApps);

function constructDataModels(el) {
  const data = {};
  Array.from(el.querySelectorAll('[v-model]')).forEach((input) => {
    const attributeNames = input.getAttributeNames();

    const vModelName = input.getAttribute('v-model');

    let defaultValue = null;
    if (input.nodeName.toLowerCase() === 'select') {
      // TODO handle multiselect
      defaultValue = input.querySelector('[selected]').value;
    } else if (attributeNames.includes('value')) {
      defaultValue = input.getAttribute('value');
    }
    touch(data, vModelName, defaultValue);
  });
  models.set(el, data);
}

function instantiateApps(el) {
  const data = models.get(el);

  data.isMounted = false;

  // FIXME: this function is specifically for creating form apps; we'll need to
  // be a bit more intelligent for non-form elements

  // replace teh form's default submit handler with our own
  // TODO do we want to do this conditionally and allow for custom submit
  // handlers ?
  el.setAttribute('v-on:submit.prevent', 'validateBeforeSubmit');
  // Disable the built-in browser form validation UI once Vue mounts
  el.setAttribute(':novalidate', 'isMounted');
  // Set .mounted on the form; this lets us use css to hide v-if blocks until
  // the Vue lifecycle can take over.
  el.setAttribute(':class', '{ "press-mounted": isMounted }');

  new Vue({
    el,
    data,
    mounted() {
      // run on nextTick to avoid potentially showing the error divs before we
      // finish initializing
      this.$nextTick(() => {
        this.isMounted = true;
      });
    },
    methods: {
      validateBeforeSubmit: function validateBeforeSubmit(event) {
        this.$validator.validateAll().then((result) => {
          if (result) {
            // We're not pulling from this.data because we want to use the
            // original form field `name`s rather than the (potentially
            // nested) model paths.
            const submission = Array.from(
              event.target.querySelectorAll('input,select,textarea')
            ).reduce((acc, input) => {
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
 * Ensures values exist at all leaves of a Vue app's initial data model
 * @param {Object} obj
 * @param {string} path
 * @param {any} value
 */
function touch(obj, path, value) {
  if (!has(obj, path)) {
    set(obj, path, value);
  }
}

// We want to add client-side validation but still behave like a normal form
// post, so we'll copy the form data to a new form and submit it without the
// JavaScript interceptor.
function repost(action, method, data) {
  const form = document.createElement('form');
  form.method = method;
  form.style.display = 'none';
  document.body.appendChild(form);
  form.action = action;
  Object.entries(data).forEach(([key, value]) => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = value;
    form.appendChild(input);
  });
  form.submit();
}
