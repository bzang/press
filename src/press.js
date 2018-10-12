import {TypeNarrowingError} from './lib/errors';
import {startsWith} from './lib/polyfills';
import {vueify} from './lib/vueify';

/** @type {WeakMap<Press, Map<string, IPressComponent>>} */
const components = new WeakMap();

/** @type {WeakMap<Press, Logger>} */
const loggers = new WeakMap();

/**
 * PRESS kernel
 */
export class Press {
  /** @returns {Map<string, IPressComponent>} */
  get components() {
    let comps = components.get(this);
    if (!comps) {
      comps = new Map();
      components.set(this, comps);
    }
    return comps;
  }

  /** @returns {Logger} */
  get logger() {
    const logger = loggers.get(this);
    if (!logger) {
      throw new TypeNarrowingError(
        'Somehow, logger is not defined. This should be impossible.'
      );
    }
    return logger;
  }

  /**
   * @param {{logger: Logger}} options
   */
  constructor({logger}) {
    loggers.set(this, logger);
  }

  /**
   * @param {IPressComponent} component
   * @param {string} [name] - override the component's name in order to get around name collisions
   */
  registerComponent(component, name) {
    let componentName = (name || component.name).toLowerCase();
    if (!startsWith(componentName, 'press-')) {
      componentName = `press-${componentName}`;
    }
    this.logger.info(`Registering component ${componentName}`);
    this.components.set(componentName, component);
    this.logger.info(`Registered component ${componentName}`);
  }

  /**
   * Invokes each registered component's {@link PressComponent#infer()} method.
   * @private
   */
  infer() {
    performance.mark('press:infer:components:start');
    this.logger.info('Inferring component types');

    Array.from(this.components.entries()).forEach(([name, component]) => {
      if (component.infer) {
        performance.mark(`press:infer:components:${name}:start`);
        this.logger.info(`Inferring ${name}`);
        component.infer(document);
        this.logger.info(`Inferred ${name}`);
        performance.mark(`press:infer:components:${name}:end`);
      }
    });

    this.logger.info('Inferred component types');
    performance.mark('press:infer:components:end');
  }

  /**
   * Invokes the appropriate component's {@link PressComponent#enhance()} method
   * for each element matching `[data-press-component]`.
   * @private
   */
  enhance() {
    performance.mark('press:enhance:components:start');
    this.logger.info('Enhancing components');

    Array.from(this.components.entries()).forEach(([name, component]) => {
      performance.mark(`press:enhance:components:${name}:start`);

      // This is the right place to check for enhance...
      if (component.enhance) {
        this.logger.info(`Enhancing ${name}`);
        const elements = Array.from(document.querySelectorAll(name));
        elements.forEach((el) => {
          // ...and this is where typescript thinks we need to check for enhance
          if (component.enhance) {
            if (!(el instanceof HTMLElement)) {
              throw new TypeNarrowingError();
            }
            this.logger.info(`Enhancing a ${name} instance`);
            component.enhance(el);
            this.logger.info(`Enhanced a ${name} instance`);
          }
        });
        this.logger.info(`Enhanceed ${name}`);
      }

      performance.mark(`press:enhance:components:${name}:end`);
    });

    this.logger.info('Enhanced components');
    performance.mark('press:enhance:components:end');
  }

  /**
   * Activates a Vue instance for each discovered `[data-press-app]` element
   * @private
   */
  activate() {
    performance.mark('press:activate:start');
    this.logger.info('Vueifying non-apped PRESS component');
    Array.from(document.querySelectorAll('[data-press-app]')).forEach(
      (root) => {
        if (!(root instanceof HTMLElement)) {
          throw new TypeNarrowingError();
        }
        vueify(this.logger, root);
      }
    );
    this.logger.info('Vueified non-apped PRESS component');
    performance.mark('press:activate:end');
  }

  /**
   * Generates a report from the marked performance entries and logs it to the
   * console, prefferring the table() method if available.
   */
  report() {
    const results = performance
      .getEntriesByType('mark')
      .filter(({name}) => startsWith(name, 'press'));

    if (this.logger.table) {
      this.logger.table(results.map(({name, startTime}) => [name, startTime]));
    } else {
      this.logger.info(results.map(({name, startTime}) => ({name, startTime})));
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
