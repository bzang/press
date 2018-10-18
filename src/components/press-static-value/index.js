import PressComponentBase from '../../press-component';
import {normalizeKeyPath} from '../../lib/vuetilities';
import {copyAttributes, replace} from '../../lib/html';

/**
 * press component for press-static-value tag
 */
export default class PressStaticValue extends PressComponentBase {
  /** @returns {'static-value'} */
  get name() {
    return 'static-value';
  }

  /**
   * @param {HTMLElement} el
   */
  enhance(el) {
    const rawKeyPath = el.getAttribute('press-key-path');
    if (!rawKeyPath) {
      this.logger.error(
        '<press-static-value> may not be used without a press-key-path attribute'
      );
      return;
    }

    const input = document.createElement('input');
    input.setAttribute('type', 'hidden');
    input.setAttribute('v-model', normalizeKeyPath(rawKeyPath));

    const value = el.getAttribute('press-value');
    if (value) {
      input.setAttribute('value', value);
    }

    copyAttributes(['class', 'id'], el, input);

    replace(el, input);
  }
}
