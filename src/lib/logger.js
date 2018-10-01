/* eslint-disable no-console */

/* eslint-disable no-unused-vars */

/**
 * noop callback
 * @param {...any} args
 * @returns {undefined};
 */
function noop(...args) {
  return undefined;
}
/* eslint-enable no-unused-vars */

const devLogger = console;
/** @type {Logger} */
const prodLogger = {
  debug: noop,
  /**
   * Production error logger
   * @param  {...any} args
   */
  error(...args) {
    console.error(...args);
  },
  info: noop,
  warn: noop
};

const PROD = process.env.NODE_ENV === 'production';

export const logger = PROD ? prodLogger : devLogger;
/* eslint-enable no-console */
