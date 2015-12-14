'use strict';

const debug = require('debug')('ipc-prefs');
const electron = require('electron');
const ipcMain = electron.ipcMain;
const BrowserWindow = electron.BrowserWindow;
const prefsHosts = require('./prefs-hosts');

/**
 * Get hosts preference
 */
ipcMain.on('prefs.hosts.get!', function (e) {
  debug('prefs.hosts.get!');
  prefsHosts.load()
    .then(
      function (prefs) {
        debug('loaded prefs', prefs);
        e.sender.send('prefs.hosts.get%', prefs);
      },
      function (error) {
        debug('load prefs', error);
      });
});

/**
 * Set hosts preference
 */
ipcMain.on('prefs.hosts.set!', function (e, prefs) {
  prefsHosts.save(prefs)
    .then(
      function () {
        let windows = BrowserWindow.getAllWindows();
        for (let i = 0, end = windows.length; i < end; ++i) {
          windows[i].webContents.send('prefs.hosts.set%', prefs);
        }
      },
      function (error) {
        debug('prefs.hosts.set~');
        e.sender.send('prefs.hosts.set~', { error });
      })
    .then(null, function (e) { debug(e); });
});
