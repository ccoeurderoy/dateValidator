const Holidays = require('date-holidays');
const moment = require('moment');
const hd = new Holidays();

class DateValidator {

  constructor(exludeWeekend, exludeHolidays, beginingTime, endingTime, country, state, region, opts) {
    hd.init(country, state, region, opts);

    let validBeginingTime = moment(beginingTime, 'HH:mm').isValid();
    let validEndingTime = moment(endingTime, 'HH:mm').isValid();
    let validInterval = moment(beginingTime, 'HH:mm').isBefore(moment(endingTime, 'HH:mm'));

    if (!validBeginingTime || !validEndingTime || !validInterval) {
      throw new Error('INVALID_PARAMETERS');
    }

    this.beginingTime = beginingTime;
    this.endingTime = endingTime;
    this.exludeWeekend = exludeWeekend;
    this.exludeHolidays = exludeHolidays ;
  }

  isValidTime(time) {

    if (!moment(time, 'HH:mm').isValid()) {
      throw new Error('INVALID_PARAMETERS');
    }

    let timeAfterBegining =  moment(time, 'HH:mm').isSameOrAfter(moment(this.beginingTime, 'HH:mm'));
    let timeBeforeEnding = moment(time, 'HH:mm').isSameOrBefore(moment(this.endingTime, 'HH:mm'));
    let isValidTime = timeAfterBegining && timeBeforeEnding;

    return (isValidTime);
  }

  isValidDate(date) {
    if (!moment(date).isValid()) {
      throw new Error('INVALID_PARAMETERS');
    }
    let time = moment(date).format('HH:mm') ;
    let isValidTime = this.isValidTime(time);
    let isHoliday = hd.isHoliday(date);
    let isWeekend = this.isWeekend(date);
    let isValidDate = true;

    if (this.exludeHolidays && isHoliday) {
      isValidDate = false;
    }

    if (this.exludeWeekend && isWeekend) {
      isValidDate = false;
    }

    if (!isValidTime) {
      isValidDate = false;
    }
    return isValidDate;
  }

  isWeekend (date) {

    if (!moment(date).isValid()) {
      throw new Error('INVALID_PARAMETERS');
    }

    let isoWeekDay = moment(date).isoWeekday();

    if (isoWeekDay === 7 || isoWeekDay === 6) {
      return true;
    }

    return false;

  }

  nextValidDate(date) {

    if (!moment(date).isValid()) {
      throw new Error('INVALID_PARAMETERS');
    }


    if (this.isValidDate(date)) {
      return date;
    }

    const hoursOfStart = moment(this.beginingTime, 'HH:mm').hours();
    const minutesOfStart = moment(this.beginingTime, 'HH:mm').minutes();
    const hoursOfEnd = moment(this.endingTime, 'HH:mm').hours();
    const minutesOfEnd = moment(this.endingTime, 'HH:mm').minutes();
    const startOfLimit = moment(date).hours(hoursOfStart).minutes(minutesOfStart);
    const endOfLimit = moment(date).hours(hoursOfEnd).minutes(minutesOfEnd);
    // If the date is after the limit, add a day
    if (moment(date, 'HH:mm').isAfter(endOfLimit)) {
      date = moment(date).add(1, 'days');
    }

    if (moment(date, 'HH:mm').isBefore(startOfLimit) || (moment(date, 'HH:mm').isAfter(endOfLimit))) {
      date = moment(date).hours(hoursOfStart).format();
      date = moment(date).minutes(minutesOfStart).format();
    }

    // If it's still not valid (holidays maybe),
    // Add a day
    while (!this.isValidDate(date)) {
      date = moment(date).add(1, 'days').format();
    }
    date = moment(date).hours(hoursOfStart).format();
    date = moment(date).minutes(minutesOfStart).format();

    return date;
  }
}

module.exports = DateValidator;
