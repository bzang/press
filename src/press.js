/**
 * @typedef {Object} PressComponent
 *
 * @property {Function} enhance
 * @property {string} name
 */

/** @type {Map<string, PressComponent>} */
const components = new Map();

/**
 *
 *
 * @param {Element|HTMLElement} el
 */
export function enhanceComponent(el) {
  if (!(el instanceof HTMLElement)) {
    return;
  }
  console.info('Enhancing component');
  const componentName = el.dataset.pressComponent;
  console.info(`Finding enhancer for ${componentName}`);
  const component = components.get(componentName);
  if (!component) {
    console.warn(
      `Component "${componentName}" has not be registered with PRESS`
    );
    return;
  }
  console.info(`Found enhancer for ${componentName}`);

  console.info(`Enhancing element with ${componentName}`);
  component.enhance(el);
  console.info(`Enhanced element with ${componentName}`);
}

/**
 *
 * @param {PressComponent} component
 */
export function registerComponent(component) {
  console.info(`Registering component ${component.name}`);
  components.set(component.name, component);
  console.info(`Registered component ${component.name}`);
}
