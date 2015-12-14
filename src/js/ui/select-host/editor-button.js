'use strict';

const flight = require('flightjs');

module.exports = flight.component(component);

function component() {
  this.after('initialize', function () {
    this.on('click', function () {
      this.trigger('data.window.prefs.editor.open!');
    });
  });
}
