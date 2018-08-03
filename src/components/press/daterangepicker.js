import Vue from 'vue';
import daterangepicker from '../vue/daterangepicker.vue';
import {
  bindToHiddenInput,
  normalizeKeyPath,
  vModelFromNode
} from '../../lib/vue-helpers';

Vue.component('daterangepicker', daterangepicker);

/**
 * @param {HTMLElement} el
 */
export function enhance(el) {
  const [startEl, endEl, ...rest] = Array.from(
    el.querySelectorAll('input[type="date"]')
  );
  if (rest.length) {
    throw new Error('Too many date inputs were found under el');
  }
  if (!startEl || !endEl) {
    throw new Error('Too few date inputs were found under el');
  }

  const startAttrs = findParameters(el, startEl);
  const endAttrs = findParameters(el, endEl);

  const baseModelName = findModelBaseName(startAttrs, endAttrs);

  el.setAttribute('v-if', 'false');
  bindToHiddenInput(el, startAttrs);
  bindToHiddenInput(el, endAttrs);

  const startKey = startAttrs.vModel.replace(`${baseModelName}.`, '');
  const endKey = endAttrs.vModel.replace(`${baseModelName}.`, '');

  const drp = document.createElement('daterangepicker');
  drp.setAttribute('v-model', baseModelName);
  drp.setAttribute('start-key', startKey);
  drp.setAttribute('end-key', endKey);
  drp.setAttribute(
    'value',
    JSON.stringify({
      [startKey]: startAttrs.value,
      [endKey]: endAttrs.value
    })
  );
  el.after(drp);
}

/**
 * Finds the root model path for the two date inputs
 * @param {DateRangePickerInputAttributes} startAttrs
 * @param {DateRangePickerInputAttributes} endAttrs
 * @returns {string}
 */
function findModelBaseName(startAttrs, endAttrs) {
  const startKeys = startAttrs.vModel.split('.');
  const endKeys = endAttrs.vModel.split('.');

  /** @type {string[]} */
  const intersection = [];

  let i = 0;
  while (
    i < endKeys.length &&
    i < startKeys.length &&
    endKeys[i] === startKeys[i]
  ) {
    intersection.push(startKeys[i]);
    i++;
  }

  if (!intersection.length) {
    throw new Error(
      `start and end date elements do not share a common base name; could not determine model for ${
        startAttrs.vModel
      } and ${endAttrs.vModel}`
    );
  }

  return intersection.join('.');
}

/**
 * @typedef {Object} DateRangePickerInputAttributes
 * @property {string|null} id
 * @property {string|null} label
 * @property {string} vModel
 * @property {string} name
 * @property {string|null} placeholder
 * @property {string|null} value
 */

/**
 * @param {HTMLElement} el
 * @param {HTMLInputElement} input
 * @returns {DateRangePickerInputAttributes}
 */
function findParameters(el, input) {
  const name = input.getAttribute('name');
  if (!name) {
    throw new Error('input element is missing name attribute');
  }
  const vModel = normalizeKeyPath(vModelFromNode(input));
  input.setAttribute('v-model', vModel);
  const id = input.getAttribute('id');
  const placeholder = input.getAttribute('placeholder');
  let label = '';
  if (id) {
    const labelEl = el.querySelector(`[for="${id}]`);
    if (labelEl) {
      label = labelEl.innerHTML;
    }
  }
  const value = input.getAttribute('value');

  return {
    id,
    label,
    vModel,
    name,
    placeholder,
    value
  };
}

export const name = 'daterangepicker';
