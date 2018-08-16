import {vueify} from './lib/vueify';

export class Press {
  get components() {
    let comps = components.get(this);
    if (!comps) {
      comps = new Map();
      components.set(this, comps);
    }
    return comps;
  }

  get logger() {
    const logger = loggers.get(this);
    if (!logger) {
      throw new TypeError(
        'Somehow, logger is not defined. This should be impossible.'
      );
    }
    return logger;
  }

  /**
   * @param {{logger: Console}} options
   */
  constructor({logger = console} = {logger: console}) {
    loggers.set(this, logger);
  }

  /**
   * @param {IPressComponent} component
   * @param {string} [name] - override the component's name in order to get around name collisions
   */
  registerComponent(component, name) {
    this.logger.info(`Registering component ${component.name}`);
    this.components.set(name || component.name, component);
    this.logger.info(`Registered component ${component.name}`);
  }

  /**
   * Invokes each registered component's {@link PressComponent#infer()} method.
   * @private
   */
  infer() {
    performance.mark('press:infer:components:start');
    this.logger.info('Inferring component types');

    for (const [name, component] of this.components) {
      performance.mark(`press:infer:components:${name}:start`);
      this.logger.info(`Inferring ${name}`);

      if (component.infer) {
        component.infer(document);
      }

      this.logger.info(`Inferred ${name}`);
      performance.mark(`press:infer:components:${name}:end`);
    }

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

    Array.from(document.querySelectorAll('[data-press-component]')).forEach(
      (el) => {
        if (!(el instanceof HTMLElement)) {
          throw new TypeError('Only HTMLElements can be enhanced by PRESS');
        }
        this.enhanceComponent(el);
      }
    );

    this.logger.info('Enhanced components');
    performance.mark('press:enhance:components:end');
  }

  /**
   * Enhances the specified element
   * @param {HTMLElement} el
   * @private
   */
  enhanceComponent(el) {
    if (el.matches('[data-press-component] [data-press-component]')) {
      this.logger.info(
        'Element is a child of another press component, not enhancing'
      );
      return;
    }
    this.logger.info('Enhancing component');
    const componentName = el.dataset.pressComponent;
    if (!componentName) {
      throw new Error(
        'Cannot enhanced a component that does not specify its component type'
      );
    }
    this.logger.info(`Finding enhancer for ${componentName}`);
    const component = this.components.get(componentName);
    if (!component) {
      this.logger.warn(
        `Component "${componentName}" has not be registered with PRESS`
      );
      return;
    }
    this.logger.info(`Found enhancer for ${componentName}`);

    this.logger.info(`Enhancing element with ${componentName}`);
    component.enhance(el);
    this.logger.info(`Enhanced element with ${componentName}`);
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
          throw new TypeError('PRESS may only be activated on HTMLElements');
        }
        vueify(root);
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
      .filter(({name}) => name.startsWith('press'));

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

/** @type {WeakMap<Press, Map<string, IPressComponent>>} */
const components = new WeakMap();

/** @type {WeakMap<Press, Console>} */
const loggers = new WeakMap();
