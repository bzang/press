import {get} from 'lodash';
import {v4 as uuid} from 'uuid';
import Vue from 'vue';

import {bindToHiddenInput, vModelFromNode} from '../../lib/vuetilities';
import PressComponentBase from '../../press-component';

import daterangepicker from './press-daterangepicker.vue';

Vue.component('press-daterangepicker', daterangepicker);
/**
 * press component for press-daterangepicker tag
 */
export default class DateRangePicker extends PressComponentBase {
  /** @returns {'daterangepicker'} */
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

    const value = {[endKey]: null, [startKey]: null};

    /** @type {string|Object} */
    let rawValue = el.getAttribute('value');
    el.removeAttribute('value');
    if (rawValue) {
      rawValue = JSON.parse(rawValue);
      value[startKey] = get(rawValue, `${name}[${startKey}]`, null);
      value[endKey] = get(rawValue, `${name}[${endKey}]`, null);
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
