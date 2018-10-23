import Vue from 'vue';

import {touch} from './touch';
import {vModelFromNode, normalizeKeyPath} from './vuetilities';
import {TypeNarrowingError} from './errors';
import {getAttributeNames} from './polyfills';
import {querySelectorAll} from './html';
/**
 * Generates a data model and instantiates a Vue app at el
 * @param {Logger} logger
 * @param {HTMLElement} root
 */
export function vueify(logger, root) {
  const data = {isMounted: false};

  performance.mark('press:vueify:createmodels:start');
  // Ensure all named elements have v-models so their contents are available to
  // the page model
  querySelectorAll(
    root,
    '[name]:not([v-model]):not(button):not([type="submit"]):not([type="button"])'
  ).forEach((el) => {
    const vModelName = normalizeKeyPath(vModelFromNode(el));
    el.setAttribute('v-model', vModelName);
  });
  performance.mark('press:vueify:createmodels:end');

  performance.mark('press:vueify:fixcheckboxes:start');
  fixCheckboxes(logger, root);
  fixSelects(logger, root);
  fixRadios(logger, root);
  performance.mark('press:vueify:fixcheckboxes:end');

  performance.mark('press:vueify:generatemodel:start');
  querySelectorAll(root, '[v-model]').forEach((el) => {
    generateModel(el, data);
  });
  performance.mark('press:vueify:generatemodel:start');
  root.setAttribute(':class', '{"press-mounted": isMounted}');

  logger.info('data model', data);

  /* eslint-disable sort-keys */
  new Vue({
    el: root,
    data,
    /** lifecycle hook */
    mounted() {
      // run on nextTick to avoid potentially showing templates before
      // initialization complete
      this.$nextTick(() => {
        this.isMounted = true;
      });
    }
  });
  /* eslint-enable sort-keys */
}

/**
 * Adds the specified element's v-model to the data model, if it has one.
 * @param {HTMLElement} el
 * @param {Object} data
 */
function generateModel(el, data) {
  const attributeNames = getAttributeNames(el);

  const vModelName = vModelFromNode(el);

  let defaultValue = null;
  switch (el.nodeName.toLowerCase()) {
    case 'select':
      defaultValue = generateModelForSelect(el);
      break;
    case 'textarea':
      defaultValue = generateModelForTextarea(el);
      break;
    case 'input':
      defaultValue = generateModelForInput(el);
      break;
    default:
      if (attributeNames.includes('value')) {
        defaultValue = el.getAttribute('value');
      }
  }

  touch(data, vModelName, defaultValue);
}

/**
 * @param {HTMLElement} el
 * @returns {boolean|string|null}
 */
function generateModelForInput(el) {
  if (el.getAttribute('type') === 'checkbox') {
    if (!(el instanceof HTMLInputElement)) {
      throw new TypeNarrowingError();
    }
    return el.checked;
  } else if (getAttributeNames(el).includes('value')) {
    return el.getAttribute('value');
  }
  return null;
}

/**
 * @param {HTMLElement} el
 * @returns {string|null}
 */
function generateModelForSelect(el) {
  /** @type {HTMLOptionElement|null} */
  const option = el.querySelector('option[selected]');
  if (option) {
    return option.value;
  }
  return null;
}

/**
 * @param {HTMLElement} el
 * @returns {string|null}
 */
function generateModelForTextarea(el) {
  return el.innerText || el.innerHTML || null;
}

/**
 * Rails, for example, does some novel things to make checkboxes work. We need
 * to make sure PRESS doesn't break them.
 * @param {Logger} logger
 * @param {HTMLElement} root
 */
function fixCheckboxes(logger, root) {
  querySelectorAll(root, 'input[type="hidden"]').forEach((el) => {
    const name = el.getAttribute('name');
    if (name) {
      const checkboxes = root.querySelectorAll(
        `input[type="checkbox"][name="${name}"]`
      );
      if (checkboxes.length === 1) {
        el.removeAttribute('v-model');
      } else if (checkboxes.length > 1) {
        logger.warn(`multiple checkboxes appear to have the name ${name}`);
      }
    }
  });
}

/**
 *
 * @param {Logger} logger
 * @param {HTMLElement} root
 */
function fixSelects(logger, root) {
  querySelectorAll(root, 'select').forEach((el) => {
    const options = el.querySelectorAll('option[selected]');
    if (options.length === 0) {
      const first = el.querySelector('option');
      if (first) {
        first.setAttribute('selected', '');
      }
    }
  });
}

/**
 * @param {Logger} logger
 * @param {HTMLElement} root
 */
function fixRadios(logger, root) {
  querySelectorAll(root, '[type=radio]').forEach((el) => {
    const name = el.getAttribute('name');
    if (name) {
      const hidden = querySelectorAll(root, `[type="hidden"][name="${name}"]`);
      if (hidden.length !== 1) {
        return;
      }

      // Rails's (actually, simple_form's) radio groups come with an extra
      // hidden input that breaks the visible radio buttons. We never want its
      // value to change so the easiest way to do that is to ensure it has a
      // different v-model while keeping its name to maintain the Rails form
      // behavior.
      hidden[0].setAttribute('v-model', `rails.${name}`);
    }
  });
}
