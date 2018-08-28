import * as moment from 'moment';

export const shortMonthFormat = 'MMM D, YYYY';
export const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

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
    .format(shortMonthFormat);
}
