import Vue from 'vue';
// @ts-ignore - tsc isn't picking up vue files correctly
import datepicker from '../vue/datepicker.vue';
import {normalizeKeyPath} from '../../lib/normalize-key-path';

Vue.component('datepicker', datepicker);

/**
 * @param {Element|HTMLElement} el
 */
export function enhance(el) {
  if (!(el instanceof HTMLInputElement)) {
    return;
  }

  const attributeNames = el.getAttributeNames();
  const name = el.getAttribute('name');

  // Figure out the m-model name
  let vModelName;
  if (attributeNames.includes('v-model')) {
    vModelName = el.getAttribute('v-model');
  } else {
    vModelName = name;
  }

  // replace the v-model name with a normalized version of same.
  el.setAttribute('v-model', normalizeKeyPath(vModelName));

  // Configure the element to disappear as soon as Vue takes over
  el.setAttribute('v-if', 'false');

  // Create a `<datepicker>` element *without a `name`* attribute for the user
  // to interact with.
  const pdp = document.createElement('datepicker');
  pdp.setAttribute('v-model', el.getAttribute('v-model'));
  const value = el.getAttribute('value');
  if (value) {
    pdp.setAttribute('value', value);
  }

  el.after(pdp);

  // Bind the `<datepicker>` to a `name`d hidden input which will do the actual
  // submission
  const php = document.createElement('input');
  php.setAttribute('type', 'hidden');
  php.setAttribute('name', el.getAttribute('name'));
  php.setAttribute('v-model', el.getAttribute('v-model'));

  el.after(php);
}

/**
 * @param {Document|HTMLElement} root
 */
export function infer(root) {
  Array.from(root.querySelectorAll('input[type="date"]')).forEach((el) => {
    if (!(el instanceof HTMLElement)) {
      return;
    }
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
