'use strict';

const flight = require('flightjs');

module.exports = flight.component(component);

function component() {
  this.attributes({
    clearLogMenuItemSelector: '#menu-item-clear-log'
  });

  this.onClearLogClick = function (e) {
    this.trigger('ui.log.clear!');
  };

  this.after('initialize', function () {
    this.on('click', { clearLogMenuItemSelector: this.onClearLogClick });
  });
}
