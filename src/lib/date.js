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
 * @param {string} dateString
 * @returns {string}
 */
export function toLocaleString(dateString) {
  return moment(dateString)
    .startOf('day')
    .format('MMM D, YYYY');
}
