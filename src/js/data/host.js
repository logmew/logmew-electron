'use strict';

const flight = require('flightjs');
const ipcRenderer = window.require('electron').ipcRenderer;

module.exports = flight.component(component);

function component() {
  this.after('initialize', function () {
    ipcRenderer.on('logEntriesServed', (e, data) => {
      console.log('logEntries', data);
      this.trigger('dataLogEntriesServed', data);
    });

    this.on('dataPrefRequested', function () {
      console.log('dataPrefRequested');
      ipcRenderer.send('getPrefRequested');
    });

    ipcRenderer.on('getPrefServed', (e, data) => {
      console.log('getPrefServed', data);
      this.trigger('dataPrefServed', data);
    });

    this.on('dataUpdatePrefRequested', function (e, data) {
      ipcRenderer.send('setPrefRequested', data.pref);
    });

  });
}
