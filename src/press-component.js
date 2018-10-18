import {TypeNarrowingError} from './lib/errors';

/** @type WeakMap<PressComponentBase, Logger> */
const loggers = new WeakMap();

/**
 * @export
 * @abstract
 * @class PressComponent
 */
export default class PressComponentBase {
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
   * constructor
   * @param {Object} options
   * @param {Logger} options.logger
   */
  constructor({logger}) {
    loggers.set(this, logger);
  }
}
