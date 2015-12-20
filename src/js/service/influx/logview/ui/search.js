'use strict';

const flight = require('flightjs');

module.exports = flight.component(component);

function component() {
  this.attributes({
    queryBoxSelector: '.query',
    querySelector: '.prompt',
    wordCheckboxSelector: '[name="word"]',
    regexpCheckboxSelector: '[name="regexp"]',
    caseCheckboxSelector: '[name="case"]',
  });

  this.conditions = {
    query: '',
    regexp: false,
    word: false,
    caseSensitive: false
  };

  this.timerId = null;

  this.clearDelayTimer = function () {
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  };

  this.onInput = function (e) {
    this.conditions.query = e.target.value;
    if (this.conditions.query) {
      this.triggerFilter();
    } else {
      this.triggerClearFilter();
    }
  };

  this.isCoditionValid = function () {
    if (this.conditions.regexp) {
      try {
        new RegExp(this.conditions.query);
      } catch (e) {
        return false;
      }
    }
    return true;
  };

  this.triggerFilter = function () {
    if (this.conditions.query == '') return;

    this.clearDelayTimer();

    if (this.isCoditionValid()) {
      this.select('queryBoxSelector').removeClass('error');
    } else {
      this.select('queryBoxSelector').addClass('error');
      return;
    }

    this.timerId = setTimeout(() => {
      this.timerId = null;
      this.trigger('ui.log.filter!', this.conditions);
    }, 300);
  };

  this.triggerClearFilter = function () {
    this.conditions.query = '';
    this.clearDelayTimer();
    this.trigger('ui.log.filter.clear!');
  };

  this.onKeyDown = function (e) {
    if (e.keyCode === 27 && // ESC
       !e.altKey && !e.ctrlKey && !e.shiftKey) {
      e.target.value = '';
      this.triggerClearFilter();
    }
  };

  this.onConditionChange = function (e) {
    this.conditions.regexp = this.select('regexpCheckboxSelector').prop('checked');
    this.conditions.word = this.select('wordCheckboxSelector').prop('checked');
    this.conditions.caseSensitive = this.select('caseCheckboxSelector').prop('checked');

    this.select('wordCheckboxSelector').prop('disabled', this.conditions.regexp);
    this.select('regexpCheckboxSelector').prop('disabled', this.conditions.word);

    this.triggerFilter();
  };

  this.after('initialize', function () {
    this.on('input', this.onInput);
    this.on('keydown', this.onKeyDown);
    this.on('change', { wordCheckboxSelector: this.onConditionChange,
                        regexpCheckboxSelector: this.onConditionChange,
                        caseCheckboxSelector: this.onConditionChange });
  });
}
