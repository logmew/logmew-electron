'use strict';

const flight = require('flightjs');

module.exports = flight.component(component);

function component() {
  this.attributes({
    prefMenuItem: '#pref-menu-item'
  });

  this.showPreference = function (e) {
    e.preventDefault();
    console.log('click');
    this.trigger('uiShowPreferenceRequested');
  };

  this.after('initialize', function () {
    console.log('a');
    this.on('click', { prefMenuItem: this.showPreference });
  });
}
