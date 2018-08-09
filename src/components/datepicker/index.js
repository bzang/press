import Vue from 'vue';
import datepicker from './datepicker.vue';
import {
  bindToHiddenInput,
  normalizeKeyPath,
  vModelFromNode
} from '../../lib/vue-helpers';

Vue.component('datepicker', datepicker);

/**
 * @param {HTMLElement} el
 */
export function enhance(el) {
  const vModelName = normalizeKeyPath(vModelFromNode(el));

  // replace the v-model name with a normalized version of same.
  el.setAttribute('v-model', vModelName);

  // Configure the element to disappear as soon as Vue takes over
  el.setAttribute('v-if', 'false');

  // Create a `<datepicker>` element *without a `name`* attribute for the user
  // to interact with.
  const pdp = document.createElement('datepicker');
  pdp.setAttribute('v-model', vModelName);
  pdp.setAttribute('class', el.getAttribute('class') || '');

  const value = el.getAttribute('value');
  if (value) {
    pdp.setAttribute('value', value);
  }

  el.after(pdp);

  // Bind the `<datepicker>` to a `name`d hidden input which will do the actual
  // submission
  bindToHiddenInput(el);
}

/**
 * @param {Document|HTMLElement} root
 */
export function infer(root) {
  Array.from(root.querySelectorAll('input[type="date"]')).forEach((el) => {
    if (!(el instanceof HTMLElement)) {
      throw new TypeError('PRESS can only infer HTMLElements');
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
