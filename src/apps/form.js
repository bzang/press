import {stringToPath} from '../lib/string-to-path';
import {touch} from '../lib/touch';

/**
 * selects any non-button, named input, named select box, or named textarea.
 */
const inputSelector =
  'input[name]:not([type="reset"]):not([type="submit"]),select[name],textarea[name]';

/**
 * Annotates the root element of a press-app
 * @param {HTMLElement} root
 */
export function annotate(root) {
  // replace the form's default submit handler with our own
  root.setAttribute('v-on:submit.prevent', 'validateBeforeSubmit');
  // Disable the built-in browser form validation UI once Vue mounts
  root.setAttribute(':novalidate', 'isMounted');

  root.querySelectorAll(inputSelector).forEach(annotateElement);
}

/**
 * Populates a Vue apps initial `data` object by locating every v-model on the
 * page
 * @param {HTMLElement} root
 * @param {Object} data
 */
export function generateModel(root, data) {
  root.querySelectorAll('[v-model]').forEach((el) => {
    const attributeNames = el.getAttributeNames();

    const vModelName = el.getAttribute('v-model');

    let defaultValue = null;
    if (el.nodeName.toLowerCase() === 'select') {
      // TODO handle multiselect
      defaultValue = el.querySelector('[selected]').value;
    } else if (attributeNames.includes('value')) {
      defaultValue = el.getAttribute('value');
    }
    touch(data, vModelName, defaultValue);
  });
}

export function extend() {
  return {
    methods: {
      validateBeforeSubmit(event) {
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
  };
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

/**
 * Decorates the specified input (or input-like) html element with Vue
 * attributes
 * @param {HTMLElement} el
 */
function annotateElement(el) {
  const attributeNames = el.getAttributeNames();
  const name = el.getAttribute('name');

  let vModelName;
  if (attributeNames.includes('v-model')) {
    vModelName = el.getAttribute('v-model');
  } else {
    vModelName = name;
  }

  el.setAttribute('v-model', stringToPath(vModelName));

  // Ensure v-validate processes every element
  if (!attributeNames.includes('v-validate')) {
    el.setAttribute('v-validate', '');
  }

  if (el.getAttribute('type') === 'date') {
    annotateDateInput(el);
  }

  // TODO error nodes should be supplied from the server, but we're going to
  // skip that until we do the integration with simpleform
  el.after(makeErrorNode(name));
}

/**
 * Replaces the date input with the vue-hoteldatepicker single date component
 * @param {HTMLInputElement} input
 */
function annotateDateInput(input) {
  // Configure the element to disappear as soon as Vue takes over
  input.setAttribute('v-if', false);

  const pdp = document.createElement('press-datepicker');
  pdp.setAttribute('name', input.getAttribute('name'));
  pdp.setAttribute('v-model', input.getAttribute('v-model'));
  const value = input.getAttribute('value');
  if (value) {
    pdp.setAttribute('value', value);
  }

  input.after(pdp);
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
  errorEl.classList.add('press-hide-until-mount');
  return errorEl;
}
