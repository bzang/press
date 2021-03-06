import * as moment from 'moment';

export const shortMonthFormat = 'MMM D, YYYY';
const monthNames = [
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
export const defaultTextSeparator = '        →        ';
export const dateSeparator = '   →   ';
export const locale = {
  format: shortMonthFormat,
  monthNames,
  separator: dateSeparator
};

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
