'use strict';

const flight = require('flightjs');
const ipcRenderer = window.require('electron').ipcRenderer;

module.exports = flight.component(component);

function component() {
  this.after('initialize', function () {
    //--------------------------------------------------------------

    /**
     * Received request to get hosts preference
     */
    this.on('data.prefs.hosts.get!', function (e) {
      ipcRenderer.send('prefs.hosts.get!');
    });

    /**
     * Received hosts preference
     * @param {array} data
     */
    ipcRenderer.on('prefs.hosts.get%', (e, data) => {
      console.log('prefs.hosts.get%', data);
      this.trigger('data.prefs.hosts.get%', data);
    });

    /**
     * Received error info on getting hosts preference
     * @param {array} data
     */
    ipcRenderer.on('prefs.hosts.get~', (e, data) => {
      console.error('prefs.hosts.get~', data);
      this.trigger('data.prefs.hosts.get~', data);
    });

    //--------------------------------------------------------------

    /**
     * Received request to set hosts preference
     * @param {array} data
     */
    this.on('data.prefs.hosts.set!', function (e, data) {
      ipcRenderer.send('prefs.hosts.set!', data);
    });

    /**
     * Received hosts setting response
     * @param {array} data
     */
    ipcRenderer.on('prefs.hosts.set%', (e, data) => {
      console.log('prefs.hosts.set%', data);
      this.trigger('data.prefs.hosts.set%', data);
    });

    /**
     * Received error info on setting hosts preference
     * @param {array} data
     */
    ipcRenderer.on('prefs.hosts.set~', (e, data) => {
      console.error('prefs.hosts.set~', data);
      this.trigger('data.prefs.hosts.set~', data);
    });

    //--------------------------------------------------------------

    /**
     * Receivied request to show hosts preference editor
     */
    this.on('data.window.prefs.editor.open!', function (e) {
      ipcRenderer.send('window.hosts-editor.open!');
    });

    /**
     * Receivied request to show log viewer
     */
    this.on('data.window.logview.open!', function (e, data) {
      ipcRenderer.send('window.logview.open!', data);
    });
  });
}
