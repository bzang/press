import {logger} from './lib/logger';
import {vueify} from './lib/vueify';

export class Press {
  get components() {
    return components.get(this);
  }

  get logger() {
    return loggers.get(this);
  }

  /**
   * @param {{logger: Console}} options
   */
  constructor({logger = console} = {logger: console}) {
    components.set(this, new Map());
    loggers.set(this, logger);
  }

  /**
   * @param {PressComponent} component
   */
  registerComponent(component) {
    logger.info(`Registering component ${component.name}`);
    this.components.set(component.name, component);
    logger.info(`Registered component ${component.name}`);
  }

  /**
   * Invokes each registered component's {@link PressComponent#infer()} method.
   * @private
   */
  infer() {
    performance.mark('press:infer:components:start');
    logger.info('Inferring component types');

    for (const [name, component] of this.components) {
      performance.mark(`press:infer:components:${name}:start`);
      logger.info(`Inferring ${name}`);

      component.infer(document);

      logger.info(`Inferred ${name}`);
      performance.mark(`press:infer:components:${name}:end`);
    }

    logger.info('Inferred component types');
    performance.mark('press:infer:components:end');
  }

  /**
   * Invokes the appropriate component's {@link PressComponent#enhance()} method
   * for each element matching `[data-press-component]`.
   * @private
   */
  enhance() {
    performance.mark('press:enhance:components:start');
    logger.info('Enhancing components');

    Array.from(document.querySelectorAll('[data-press-component]')).forEach(
      (el) => this.enhanceComponent(el)
    );

    logger.info('Enhanced components');
    performance.mark('press:enhance:components:end');
  }

  /**
   * Enhances the specified element
   * @param {Element|HTMLElement} el
   * @private
   */
  enhanceComponent(el) {
    if (!(el instanceof HTMLElement)) {
      return;
    }
    logger.info('Enhancing component');
    const componentName = el.dataset.pressComponent;
    logger.info(`Finding enhancer for ${componentName}`);
    const component = this.components.get(componentName);
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
   * Activates a Vue instance for each discovered `[data-press-app]` element
   * @private
   */
  activate() {
    performance.mark('press:activate:start');
    logger.info('Vueifying non-apped PRESS component');
    Array.from(document.querySelectorAll('[data-press-app]')).forEach(
      (root) => {
        if (!(root instanceof HTMLElement)) {
          return;
        }
        vueify(root);
      }
    );
    logger.info('Vueified non-apped PRESS component');
    performance.mark('press:activate:end');
  }

  /**
   * Generates a report from the marked performance entries and logs it to the
   * console, prefferring the table() method if available.
   */
  report() {
    const results = performance
      .getEntriesByType('mark')
      .filter(({name}) => name.startsWith('press'));

    if (logger.table) {
      logger.table(results.map(({name, startTime}) => [name, startTime]));
    } else {
      logger.info(results.map(({name, startTime}) => ({name, startTime})));
    }
  }

  /**
   * Executes PRESS lifecycle methods
   */
  run() {
    this.infer();
    this.enhance();
    this.activate();
    if (process.env.NODE_ENV !== 'production') {
      this.report();
    }
  }
}

/** @type {WeakMap<Press, Map<string, PressComponent>>} */
const components = new WeakMap();

/** @type {WeakMap<Press, Console>} */
const loggers = new WeakMap();
