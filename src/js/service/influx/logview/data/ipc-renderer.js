'use strict';

const flight = require('flightjs');
const ipcRenderer = window.require('electron').ipcRenderer;

module.exports = flight.component(component);

function component() {
  this.after('initialize', function () {
    //--------------------------------------------------------------

    /**
     * Received request to get log entries
     * @param {hash} data
     * <pre>
     * backward {bool}
     * limit    {int}
     * </pre>
     */
    this.on('data.log.fetch!', function (e, data) {
      console.log('data.log.fetch!', data);
      ipcRenderer.send('influx.log.fetch!', {
        backward: data.backward,
        baseTime: data.baseTime,
        limit: data.limit
      });
    });

    /**
     * Received fetched log entries
     * @param {hash} data
     * <pre>
     * entries {array}
     * </pre>
     */
    ipcRenderer.on('influx.log.fetch%', (e, data) => {
      console.log('influx.log.fetch%', data);
      this.trigger('data.log.fetch%', data);
    });

    /**
     * Received error info on fetching log entries
     * @param {hash} data
     * <pre>
     * entries {array}
     * </pre>
     */
    ipcRenderer.on('influx.log.fetch~', (e, data) => {
      console.log('influx.log.fetch~', data);
      this.trigger('data.log.fetch~', data);
    });

    //--------------------------------------------------------------

    /**
     * Received request to observe incoming log
     * @param {hash} data
     * <pre>
     * limit {int}
     * baseTime {int}
     * </pre>
     */
    this.on('data.log.observe!', function (e, data) {
      ipcRenderer.send('influx.log.observe!', data);
    });

    /**
     * Received incoming log entries
     * @param {hash} data
     * <pre>
     * entries {array}
     * </pre>
     */
    ipcRenderer.on('influx.log.newentries%', (e, data) => {
      console.log('influx.log.newentries%', data);
      this.trigger('data.log.newentries%', data);
    });

    /**
     * Received error info on fetching log entries
     * @param {hash} data
     * <pre>
     * entries {array}
     * </pre>
     */
    ipcRenderer.on('influx.log.observe~', (e, data) => {
      console.error('influx.log.newentries~', data);
      this.trigger('data.log.newentries~', data);
    });

    //--------------------------------------------------------------

    /**
     * Received request to stop observing incoming log
     * @param {hash} data
     * <pre>
     * limit {int}
     * baseTime {int}
     * </pre>
     */
    this.on('data.log.unobserve!', function (e, data) {
      ipcRenderer.send('influx.log.unobserve!', data);
    });
  });
}
