/* eslint-disable no-console */
// eslint-disable-next-line no-unused-vars
function noop(...args) {
  return undefined;
}
const devLogger = console;
/** @type {Logger} */
const prodLogger = {
  error(...args) {
    console.error(...args);
  },
  warn: noop,
  info: noop,
  debug: noop
};

const PROD = process.env.NODE_ENV === 'production';

export const logger = PROD ? prodLogger : devLogger;
/* eslint-enable no-console */
