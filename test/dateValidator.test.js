const DateValidator = require('../src/DateValidator');
const assert = require('assert');
const should = require('should');
var moment = require('moment');

describe('The DateValidator', function() {
  describe('DateValidator constructor', function () {
    it('should throw an error if one time is invalid', function() {
      let country = 'FR';
      let beginingTime = 'cc:w';
      let endingTime = '19:00';
      should(() => {
        let dateValidator = new DateValidator(beginingTime, endingTime, country);
      }).throw('INVALID_PARAMETERS');
    });

    it('should throw an error if ending time is before begining time', function() {
      let country = 'FR';
      let beginingTime = '19:00';
      let endingTime = '8:00';
      should(() => {
        let dateValidator = new DateValidator(beginingTime, endingTime, country);
      }).throw('INVALID_PARAMETERS');

    });

    it('should create a dateValidator if times are valid', function() {
      let country = 'FR';
      let beginingTime = '8:00';
      let endingTime = '19:00';
      let dateValidator = new DateValidator(beginingTime, endingTime, country);
      should(dateValidator.beginingTime).eql('8:00');
      should(dateValidator.endingTime).eql('19:00');
    });
  });

  describe('Method isValidTime', function() {
    it('should return true if the given time is between beginingTime and endingTime', function() {
      let country = 'FR';
      let beginingTime = '8:00';
      let endingTime = '19:00';
      let dateValidator = new DateValidator(beginingTime, endingTime, country);
      should(dateValidator.isValidTime('10:00')).eql(true);

    });

    it('should return false if the given time is not between beginingTime and endingTime', function() {
      let country = 'FR';
      let beginingTime = '8:00';
      let endingTime = '19:00';
      let dateValidator = new DateValidator(beginingTime, endingTime, country);
      should(dateValidator.isValidTime('02:00')).eql(false);

    });

    it('should throw an error if the given time is invalid', function() {
      let country = 'FR';
      let beginingTime = '8:00';
      let endingTime = '19:00';
      let dateValidator = new DateValidator(beginingTime, endingTime, country);
      should(()=> {
        dateValidator.isValidTime('invalidTime');
      }).throw('INVALID_PARAMETERS');
    });
  });


  describe('Method isValidDate', function() {
    it('should return false if the given date is a holiday', function() {
      let country = 'FR';
      let beginingTime = '8:00';
      let endingTime = '19:00';
      let date = new Date('2017-01-01');
      let dateValidator = new DateValidator(beginingTime, endingTime, country);
      should(dateValidator.isValidDate(date)).eql(false);
    });

    it('should return false if the given time is not in the interval', function() {
      let country = 'FR';
      let beginingTime = '8:00';
      let endingTime = '19:00';
      let date = new Date('2017-08-16 00:00:00 GMT+0000');
      let dateValidator = new DateValidator(beginingTime, endingTime, country);
      should(dateValidator.isValidDate(date)).eql(false);
    });

    it('should return true if the date is not a holiday the given time is in the interval', function() {
      let country = 'FR';
      let beginingTime = '8:00';
      let endingTime = '19:00';
      let date = new Date('2017-08-16 09:00:00 GMT+0000');
      let dateValidator = new DateValidator(beginingTime, endingTime, country);
      should(dateValidator.isValidDate(date)).eql(true);
    });

    it('should throw an error if the given date is invalid', function() {
      let country = 'FR';
      let beginingTime = '8:00';
      let endingTime = '19:00';
      let dateValidator = new DateValidator(beginingTime, endingTime, country);
      should(function () {
        dateValidator.isValidDate('invalidDate');
      }).throw('INVALID_PARAMETERS');
    });
  });


  describe('Method nextValidDate', function() {
    it('should return the same date if it is a valid one', function() {
      let country = 'FR';
      let beginingTime = '8:00';
      let endingTime = '19:00';
      let date = new Date('2017-01-02 12:00');
      let dateValidator = new DateValidator(beginingTime, endingTime, country);
      should(moment(dateValidator.nextValidDate(date)).isSame(moment(date))
    ).eql(true);
    });

    it('should return the next valid date if it is not a valid one', function() {
      let country = 'FR';
      let beginingTime = '8:00';
      let endingTime = '19:00';
      let date = new Date('2017-01-01 12:00');
      let nextDate = new Date('2017-01-02 8:00');
      let dateValidator = new DateValidator(beginingTime, endingTime, country);
      should(moment(dateValidator.nextValidDate(date)).isSame(moment(nextDate))
    ).eql(true);
    });


    it('should throw an error if the given date is invalid', function() {
      let country = 'FR';
      let beginingTime = '8:00';
      let endingTime = '19:00';
      let dateValidator = new DateValidator(beginingTime, endingTime, country);
      should(()=> {
        dateValidator.nextValidDate('invalidDate');
      }).throw('INVALID_PARAMETERS');
    });
  });
});
