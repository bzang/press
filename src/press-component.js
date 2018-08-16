/**
 * @export
 * @abstract
 * @class PressComponent
 */
export default class PressComponentBase {
  get logger() {
    const logger = loggers.get(this);
    if (!logger) {
      throw new TypeError(
        'Somehow, logger is not defined. This should be impossible.'
      );
    }
    return logger;
  }

  get name() {
    return this.constructor.name.toLowerCase();
  }

  constructor({logger}) {
    loggers.set(this, logger);
  }
}

/** @type WeakMap<PressComponentBase, Logger> */
const loggers = new WeakMap();