import Vue from 'vue';
import datepicker from '../vue/datepicker.vue';
import {stringToPath} from '../../lib/string-to-path';

Vue.component('datepicker', datepicker);

/**
 *
 * @param {Element|HTMLElement} el
 */
export function enhance(el) {
  if (!(el instanceof HTMLInputElement)) {
    return;
  }

  const attributeNames = el.getAttributeNames();
  const name = el.getAttribute('name');

  let vModelName;
  if (attributeNames.includes('v-model')) {
    vModelName = el.getAttribute('v-model');
  } else {
    vModelName = name;
  }

  el.setAttribute('v-model', stringToPath(vModelName));

  if (el.getAttribute('type') === 'date') {
    annotateDateInput(el);
  }
}

/**
 * Replaces the date input with the vue-hoteldatepicker single date component
 * @param {HTMLInputElement} input
 */
function annotateDateInput(input) {
  // Configure the element to disappear as soon as Vue takes over
  input.setAttribute('v-if', 'false');

  const pdp = document.createElement('datepicker');
  // pdp.setAttribute('name', input.getAttribute('name'));
  pdp.setAttribute('v-model', input.getAttribute('v-model'));
  const value = input.getAttribute('value');
  if (value) {
    pdp.setAttribute('value', value);
  }

  input.after(pdp);

  const php = document.createElement('input');
  php.setAttribute('type', 'hidden');
  php.setAttribute('name', input.getAttribute('name'));
  php.setAttribute('v-model', input.getAttribute('v-model'));

  input.after(php);
}

/**
 *
 * @param {Document|HTMLElement} root
 */
export function infer(root) {
  Array.from(root.querySelectorAll('input[type="date"]')).forEach((el) => {
    const names = el.getAttributeNames();
    if (
      names.includes('data-press-component') ||
      names.includes('data-press-app')
    ) {
      return;
    }
    el.setAttribute('data-press-component', 'datepicker');
  });
}

export const name = 'datepicker';
