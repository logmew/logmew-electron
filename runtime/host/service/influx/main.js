'use strict';

const debug = require('debug')('influx/main');
const electron = require('electron');
const ipcMain = electron.ipcMain;
const prefsHosts = require('../../prefs-hosts');

const window = require('./window');
require('./ipc-log');

/**
 * Show log view window
 */
ipcMain.on('influx.window.logview.open!', function (e, data) {
  prefsHosts.get(data.id)
    .then(function (pref) {
      if (!pref) {
        debug('logview pref not found', data);
        return;
      }

      window.newWindow(pref);
    }).then(null, (e) => { debug(e); });
});
