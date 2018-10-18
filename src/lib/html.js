import {after, remove} from './polyfills';

/**
 * Wraps el with a press component
 *
 * @export
 * @param {HTMLElement} el
 * @param {string} componentName
 * @param {StringMap} attrs
 * @param {Logger} logger
 */
export function wrapWith(el, componentName, attrs, logger) {
  logger.info(`wrapping element with <${componentName}>`);
  const component = document.createElement(componentName);
  Object.keys(attrs).forEach((key) => {
    component.setAttribute(key, attrs[key]);
  });

  after(el, component);
  component.appendChild(el);
}

/**
 * Replaces `last` with `next`
 * @param {HTMLElement} last
 * @param {HTMLElement} next
 */
export function replace(last, next) {
  after(last, next);
  remove(last);
}

/**
 * Copies an html attribute from src to dest
 * @param {string} name
 * @param {HTMLElement} src
 * @param {HTMLElement} dest
 */
export function copyAttribute(name, src, dest) {
  const value = src.getAttribute(name) || '';
  dest.setAttribute(name, value);
}

/**
 * Copies the specified html attributes from src to dest
 * @param {string[]} names
 * @param {HTMLElement} src
 * @param {HTMLElement} dest
 */
export function copyAttributes(names, src, dest) {
  names.forEach((name) => copyAttribute(name, src, dest));
}

/**
 * Adds a remote script to the page using document.write. Use this to, for
 * example, load a google dependency
 * @param {string} src
 */
export function addRemoteScriptToPage(src) {
  /* eslint-disable prefer-template */
  // prettier-ignore
  document.write('<' + 'script src="' + src + '"' +
    ' type="text/javascript"><' + '/script>');
  /* eslint-enable prefer-template */
}
