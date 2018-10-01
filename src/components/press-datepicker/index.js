import Vue from 'vue';

import {
  bindToHiddenInput,
  normalizeKeyPath,
  vModelFromNode,
  wrapWith
} from '../../lib/vue-helpers';
import PressComponentBase from '../../press-component';
import {TypeNarrowingError} from '../../lib/errors';

import datepicker from './press-datepicker.vue';

Vue.component('press-datepicker', datepicker);

/**
 * press component for press-datepicker tag
 */
export default class DatePicker extends PressComponentBase {
  /** @returns {'datepicker'} */
  get name() {
    return 'datepicker';
  }

  /**
   * @param {HTMLElement} el
   */
  enhance(el) {
    const vModelName = normalizeKeyPath(vModelFromNode(el));
    el.setAttribute('v-model', vModelName);

    // daterangepicker.com's date picker puts the locale format in the value
    // attribute, so we can't submit it. Instead, we'll bind its ISO formatted
    // value to a hidden input field and remove the name from `el`
    bindToHiddenInput(el);
  }

  /**
   * @param {Document|HTMLElement} root
   */
  infer(root) {
    Array.from(root.querySelectorAll('input[type="date"]')).forEach((el) => {
      if (!(el instanceof HTMLElement)) {
        throw new TypeNarrowingError();
      }
      if (el.closest('press-noscript')) {
        return;
      }
      const ancestor = el.closest('press-datepicker');
      if (!ancestor) {
        this.logger.warn(
          'Inferring <press-datepicker> from input[type="date"]. Inferrence may be removed in the future; you should explicitly use <press-datepicker> here.'
        );
        wrapWith(
          el,
          'press-datepicker',
          {
            name: el.getAttribute('name') || '',
            placeholder: el.getAttribute('placeholder') || '',
            'v-model': normalizeKeyPath(vModelFromNode(el)),
            value: el.getAttribute('value') || ''
          },
          this.logger
        );
      }
    });
  }
}
