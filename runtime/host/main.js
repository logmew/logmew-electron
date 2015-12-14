'use strict';

const debug = require('debug')('main');
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const selectHostWindow = require('./window-select-host');

debug('start');

require('./ipc-prefs');
require('./ipc-window');
require('./service/influx/main');

// Report crashes to Electron server.
electron.crashReporter.start();

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
  selectHostWindow.show();
});
