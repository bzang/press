import {TypeNarrowingError} from './lib/errors';

/**
 * @export
 * @abstract
 * @class PressComponent
 */
export default class PressComponentBase {
  get logger() {
    const logger = loggers.get(this);
    if (!logger) {
      throw new TypeNarrowingError(
        'Somehow, logger is not defined. This should be impossible.'
      );
    }
    return logger;
  }

  constructor({logger}) {
    loggers.set(this, logger);
  }
}

/** @type WeakMap<PressComponentBase, Logger> */
const loggers = new WeakMap();
