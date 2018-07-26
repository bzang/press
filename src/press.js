import {logger} from './lib/logger';

/** @type {Map<string, Press.PressComponent>} */
const components = new Map();

/**
 * @param {Element|HTMLElement} el
 */
export function enhanceComponent(el) {
  if (!(el instanceof HTMLElement)) {
    return;
  }
  logger.info('Enhancing component');
  const componentName = el.dataset.pressComponent;
  logger.info(`Finding enhancer for ${componentName}`);
  const component = components.get(componentName);
  if (!component) {
    logger.warn(
      `Component "${componentName}" has not be registered with PRESS`
    );
    return;
  }
  logger.info(`Found enhancer for ${componentName}`);

  logger.info(`Enhancing element with ${componentName}`);
  component.enhance(el);
  logger.info(`Enhanced element with ${componentName}`);
}

/**
 * @param {Press.PressComponent} component
 */
export function registerComponent(component) {
  logger.info(`Registering component ${component.name}`);
  components.set(component.name, component);
  logger.info(`Registered component ${component.name}`);
}
