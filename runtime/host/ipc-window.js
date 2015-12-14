'use strict';

const debug = require('debug')('ipc-main');
const electron = require('electron');
const ipcMain = electron.ipcMain;
const editHostsWindow = require('./window-edit-hosts');
const prefsHosts = require('./prefs-hosts');

/**
 * Show edit hosts window
 */
ipcMain.on('window.hosts-editor.open!', function () {
  editHostsWindow.show();
});
