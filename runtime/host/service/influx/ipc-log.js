'use strict';

const debug = require('debug')('influx/ipc-log');
const electron = require('electron');
const BrowserWindow = electron.BrowserWindow;
const ipcMain = electron.ipcMain;

/**
 * Query and fetch log entries
 * @param {hash} e event object
 * @param {hash} criteria
 * <pre>
 *   [key]      [type]  [description]
 *   name:      string  InfluxDB connection preference name
 *   backward:  bool    search direction
 *   baseTime:  int     base time used in search
 *   limit:     int     max number of fetch rows
 * </pre>
 */
ipcMain.on('influx.log.fetch!', function (e, criteria) {
  debug(criteria);
  let window = BrowserWindow.fromWebContents(e.sender);
  window.logmew.fetcher.fetch(criteria)
    .then(
      function (data) { e.sender.send('influx.log.fetch%', data); },
      function (error) { debug('influx.log.fetch!', error); e.sender.send('influx.log.fetch~', { error }); }
    );
});

/**
 * Start observing incoming log entries
 * @param {hash} e event object
 * @param {hash} criteria
 * <pre>
 *   [key]      [type]  [description]
 *   name:      string  InfluxDB preference name
 *   baseTime:  int     base time used in search
 *   period:    int     polling period in mili-seconds
 *   limit:     int     max number of fetch rows
 * </pre>
 */
ipcMain.on('influx.log.observe!', function (e, criteria) {
  startLogObserver(e.sender, criteria);
});

/**
 * Stop observing incoming log entries
 */
ipcMain.on('influx.log.unobserve!', function (e) {
  stopLogObserver(e.sender);
});

// -- helper functions

/**
 * Start observing incoming log entries
 * @param {webContents} webContents
 * @param {hash} criteria
 * <pre>
 *   [key]      [type]  [description]
 *   name:      string  InfluxDB preference name
 *   baseTime:  int     base time used in search
 *   period:    int     polling period in mili-seconds
 *   limit:     int     max number of fetch rows
 * </pre>
 */
function startLogObserver(webContents, criteria) {
  stopLogObserver(webContents);

  let window = BrowserWindow.fromWebContents(webContents);
  let logObserver = window.logmew.observer;
  logObserver.start(criteria)
    .then(
      function () { webContents.send('influx.log.observe%'); },
      function (error) { webContents.send('influx.log.observe~', error); }
    );

  logObserver.on('data', function (data) {
    webContents.send('influx.log.newentries%', data);
  });
  logObserver.on('error', function (info) {
    debug('logObserver error', info);
    webContents.send('influx.log.newentries~', info);
  });
};

/**
 * Stop observing incoming log
 */
function stopLogObserver(webContents) {
  let window = BrowserWindow.fromWebContents(webContents);
  window.logmew.observer.stop();
  window.logmew.observer.removeAllListeners();
}
