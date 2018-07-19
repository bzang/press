import {stringToPath} from './string-to-path';

/**
 * Decorates the specified input (or input-like) html element with Vue
 * attributes
 * @param {HTMLElement} el
 */
export function annotate(el) {
  const attributeNames = el.getAttributeNames();
  const name = el.getAttribute('name');

  let vModelName;
  if (attributeNames.includes('v-model')) {
    vModelName = el.getAttribute('v-model');
  } else {
    vModelName = name;
  }

  el.setAttribute('v-model', stringToPath(vModelName));

  // Ensure v-validate processes every element
  if (!attributeNames.includes('v-validate')) {
    el.setAttribute('v-validate', '');
  }

  // TODO error nodes should be supplied from the server, but we're going to
  // skip that until we do the integration with simpleform
  el.after(makeErrorNode(name));
}

/**
 * Temporary; this should be done from the server
 * @param {string} name
 * @returns {HTMLDivElement}
 */
function makeErrorNode(name) {
  // TODO if existing error nodes cannot be found, create a tooltip node
  // Create a spot to put the element's error field
  const errorEl = document.createElement('div');
  errorEl.classList.add('error');
  errorEl.setAttribute('v-if', `errors.has('${name}')`);
  errorEl.innerHTML = `{{ errors.first('${name}') }}`;
  // Add a class to the node that'll hide it until Vue takes over the form
  errorEl.classList.add('press-hide-until-mount');
  return errorEl;
}
