'use strict';

const flight = require('flightjs');
const ipcRenderer = window.require('electron').ipcRenderer;

module.exports = flight.component(component);

function component() {
  this.createHostEntry = function (e, data) {
    if (data.type !== 'InfluxDB') return;

    let entry = Object.assign({}, data);
    entry.setting = {
      host: '',
      port: 8086,
      username: '',
      password: '',
      database: ''
    };

    this.trigger('data.prefs.hosts.service.add%', entry);
  };

  this.openLogViewWindow = function (e, data) {
    console.log('openLogViewWindow', data);
    if (data.type !== 'InfluxDB') return;
    ipcRenderer.send('influx.window.logview.open!', data);
  };

  this.after('initialize', function () {
    this.on(document, 'data.prefs.hosts.service.add!', this.createHostEntry);
    this.on(document, 'data.window.logview.open!', this.openLogViewWindow);
  });
}
