'use strict';

const flight = require('flightjs');

module.exports = flight.component(component);

function component() {
  this.attributes({
    closeButtonSelector: '.close.button',
  });

  this.onCloseButtonClick = function () {
    window.close();
  };
  
  this.after('initialize', function () {
    this.on('click', { closeButtonSelector: this.onCloseButtonClick });
  });
}
