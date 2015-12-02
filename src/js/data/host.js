'use strict';

const flight = require('flightjs');
const ipcRenderer = window.require('electron').ipcRenderer;

module.exports = flight.component(component);

function component() {
  this.after('initialize', function () {
    ipcRenderer.on('logEntriesServed', (e, data) => {
      console.log('logEntriesServed');
      this.trigger('dataLogEntriesServed', data);
    });

    this.on('dataPrefRequested', function () {
      ipcRenderer.send('getPrefRequested');
    });

    ipcRenderer.on('getPrefServed', (e, data) => {
      this.trigger('dataPrefServed', data);
    });

    this.on('dataUpdatePrefRequested', function (e, data) {
      ipcRenderer.send('setPrefRequested', data.pref);
    });
  });
}
