'use strict';

const moment = require('moment');

/**
 * @param {number} month
 * @param {number} date
 * @returns {moment.Moment}
 */
function momentFromMonthDateNextYear(month, date) {
  return moment()
    .month(month)
    .date(date)
    .year(moment().year() + 1);
}
exports.momentFromMonthDateNextYear = momentFromMonthDateNextYear;
