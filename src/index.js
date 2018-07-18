import Vue from 'vue';
import VeeValidate from 'vee-validate';
import {has, set} from 'lodash';

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

/** Holds our data models between phases. Ideally a weak map. */
const models = new WeakMap();

document.querySelectorAll(inputSelector).forEach(annotateInputs);
// TODO replace data-press-components
document.querySelectorAll(appSelector).forEach(constructDataModels);
document.querySelectorAll(appSelector).forEach(instantiateApps);
/**
 * Decorates the specified input (or input-like) html element with Vue
 * attributes
 * @param {HTMLElement} input
 */
function annotateInputs(input) {
  const attributeNames = input.getAttributeNames();
  const name = input.getAttribute('name');

  let vModelName;
  if (attributeNames.includes('v-model')) {
    vModelName = input.getAttribute('v-model');
  } else {
    vModelName = name;
    input.setAttribute('v-model', vModelName);
  }

  // TODO do we also need to set the `key` attibute? https://baianat.github.io/vee-validate/api/errorbag.html
  // Ensure v-validate processes every element
  if (!attributeNames.includes('v-validate')) {
    input.setAttribute('v-validate', '');
  }

  // TODO error nodes should be supplied from the server, but we're going to
  // skip that until we do the integration with simpleform
  input.after(makeErrorNode(name));
}

function constructDataModels(el) {
  const data = {};
  Array.from(el.querySelectorAll('[v-model]')).forEach((input) => {
    const attributeNames = input.getAttributeNames();

    const vModelName = input.getAttribute('v-model');

    let defaultValue = null;
    if (attributeNames.includes('value')) {
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
 * Temporary; this should be done from the server
 * @param {string} name
 * @returns {HTMLDivElement}
 */
function makeErrorNode(name) {
  // TODO if existing error nodes cannot be found, create a tooltip node
  // Create a spot to put the element's error field
  const errorEl = document.createElement('div');
  errorEl.classList.add('error');
  errorEl.setAttribute('v-if', `errors.has('${name}')`);
  errorEl.innerHTML = `{{ errors.first('${name}') }}`;
  // Add a class to the node that'll hide it until Vue takes over the form
  errorEl.classList.add('hide-until-mount');
  return errorEl;
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
