'use strict';

const flight = require('flightjs');
const ipcRenderer = window.require('electron').ipcRenderer;

module.exports = flight.component(component);

function component() {
  this.after('initialize', function () {
    ipcRenderer.on('logEntries', (e, data) => {
      console.log('logEntries', data);
      this.trigger('dataLogEntriesServed', data);
    });
  });
}
