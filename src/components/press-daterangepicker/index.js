import {get} from 'lodash';
import {v4 as uuid} from 'uuid';
import Vue from 'vue';
import daterangepicker from './press-daterangepicker.vue';
import {bindToHiddenInput, vModelFromNode} from '../../lib/vue-helpers';
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
    let baseVModel;
    const name = el.getAttribute('name') || '';
    try {
      baseVModel = vModelFromNode(el);
    } catch (err) {
      el.setAttribute(
        'name',
        `press-daterangepicker-${uuid()}`.replace(/-/g, '_')
      );

      baseVModel = vModelFromNode(el);
    }

    el.setAttribute('v-model', baseVModel);

    const startKey = el.getAttribute('press-start-key');
    if (!startKey) {
      throw new Error(
        '<press-daterangepicker> may not be used without a `press-start-key` attribute'
      );
    }

    const endKey = el.getAttribute('press-end-key');
    if (!endKey) {
      throw new Error(
        '<press-daterangepicker> may not be used without a `press-end-key` attribute'
      );
    }

    const value = {[startKey]: undefined, [endKey]: undefined};

    /** @type {string|Object} */
    let rawValue = el.getAttribute('value');
    el.removeAttribute('value');
    if (rawValue) {
      rawValue = JSON.parse(rawValue);
      value[startKey] = get(rawValue, `${name}[${startKey}]`);
      value[endKey] = get(rawValue, `${name}[${endKey}]`);
    }
    bindToHiddenInput(el, {
      name: name ? `${name}[${startKey}]` : startKey,
      vModel: `${baseVModel}.${startKey}`,
      value: value[startKey]
    });
    bindToHiddenInput(el, {
      name: name ? `${name}[${endKey}]` : endKey,
      vModel: `${baseVModel}.${endKey}`,
      value: value[endKey]
    });
  }

  /**
   * Finds the root model path for the two date inputs
   * @param {string} startName
   * @param {string} endName
   * @private
   * @returns {string}
   */
  findModelBaseName(startName, endName) {
    const startKeys = startName.split('.');
    const endKeys = endName.split('.');

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
}
