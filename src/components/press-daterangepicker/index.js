import {v4 as uuid} from 'uuid';
import Vue from 'vue';
import daterangepicker from './press-daterangepicker.vue';
import {
  bindToHiddenInput,
  normalizeKeyPath,
  vModelFromNode
} from '../../lib/vue-helpers';
import PressComponentBase from '../../press-component';

Vue.component('press-daterangepicker', daterangepicker);

export default class DateRangePicker extends PressComponentBase {
  get name() {
    return 'daterangepicker';
  }

  /**
   * @param {HTMLElement} el
   */
  enhance(el) {
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
    let {parentSelector} = el.dataset;
    const {parentEl} = el.dataset;
    if (parentEl) {
      let msg =
        '`data-parent-el` is deprecated. Please pass a valid css selector via `data-parent-selector`.';
      if (parentSelector) {
        msg +=
          ' Since you also passed `data-parent-selector`, you can fix this warning by simply removing `data-parent-el`';
      } else {
        parentSelector = parentEl;
        msg += `\nYou can fix this warning by replacing 'data-parent-el=${parentEl}' with 'data-parent-selector=${parentSelector}'`;
      }

      this.logger.warn(msg);
    }

    const baseModelName = this.normalizeParameters(startAttrs, endAttrs);

    el.setAttribute('v-if', 'false');
    bindToHiddenInput(el, startAttrs);
    bindToHiddenInput(el, endAttrs);

    const drp = document.createElement('press-daterangepicker');
    drp.setAttribute('class', el.getAttribute('class') || '');
    drp.setAttribute('v-model', baseModelName);
    drp.setAttribute('start-key', startAttrs.key);
    drp.setAttribute('end-key', endAttrs.key);
    if (parentSelector) {
      drp.setAttribute('parent-selector', parentSelector);
    }

    drp.setAttribute(
      'value',
      JSON.stringify({
        [startAttrs.key]: startAttrs.value,
        [endAttrs.key]: endAttrs.value
      })
    );
    el.after(drp);
  }

  /**
   * Finds the root model path for the two date inputs
   * @param {DateRangePickerInputAttributes} startAttrs
   * @param {DateRangePickerInputAttributes} endAttrs
   * @private
   * @returns {string}
   */
  findModelBaseName(startAttrs, endAttrs) {
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
      this.logger.warn(
        'start and end date elements do not share a common base name.'
      );
      return '';
    }

    return intersection.join('.');
  }

  /**
   *
   * @param {DateRangePickerInputAttributes} startAttrs
   * @param {DateRangePickerInputAttributes} endAttrs
   * @private
   * @returns {string} - the baseModelName
   */
  normalizeParameters(startAttrs, endAttrs) {
    let baseModelName = this.findModelBaseName(startAttrs, endAttrs);
    if (baseModelName) {
      startAttrs.key = startAttrs.vModel.replace(`${baseModelName}.`, '');
      endAttrs.key = endAttrs.vModel.replace(`${baseModelName}.`, '');
    } else {
      baseModelName = `daterangepicker-${uuid()}`.replace(/-/g, '_');
      startAttrs.key = startAttrs.vModel;
      startAttrs.vModel = `${baseModelName}.${startAttrs.vModel}`;
      endAttrs.key = endAttrs.vModel;
      endAttrs.vModel = `${baseModelName}.${endAttrs.vModel}`;
    }
    return baseModelName;
  }
}

/**
 * @typedef {Object} DateRangePickerInputAttributes
 * @property {string|null} id
 * @property {string} key
 * @property {string|null} label
 * @property {string} name
 * @property {string|null} placeholder
 * @property {string|null} value
 * @property {string} vModel
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
    key: '',
    label,
    vModel,
    name,
    placeholder,
    value
  };
}
