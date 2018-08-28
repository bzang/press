import * as moment from 'moment';

/**
 * @param {any} arg
 * @returns {Date|undefined}
 */
export function toDateRangePickerValue(arg) {
  if (!arg) {
    return undefined;
  }

  return moment(arg)
    .startOf('day')
    .toDate();
}

/**
 * @param {any} arg
 * @returns {string}
 */
export function toLocaleString(arg) {
  return moment(arg)
    .startOf('day')
    .format('MMM D, YYYY');
}
