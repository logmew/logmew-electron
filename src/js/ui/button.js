'use strict';

const flight = require('flightjs');
const ipcRenderer = window.require('electron').ipcRenderer;

module.exports = flight.component(component);

function component() {
  this.attributes({
    add: '#add'
  });

  this.populate = function () {
    ipcRenderer.send('go', 'hell');
  };

  this.after('initialize', function () {
    this.on("click", { add: this.populate });
  });
}
