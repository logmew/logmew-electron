'use strict';

const debug = require('debug')('influx/window');
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const LogFetcher = require('./log-fetcher');
const LogObserver = require('./log-observer');

var windows = [];

function newWindow(pref) {
  // Create the browser window.
  let window = new BrowserWindow({ width: 2000, height: 2000 });
  window.logmew = {
    pref,
    fetcher: new LogFetcher(pref),
    observer: new LogObserver(pref)
  };

  // and load the index.html of the app.
  window.loadURL('file://' + __dirname + '/../../../browser/logview-influx.html');

  // Open the DevTools.
  window.webContents.openDevTools();

  // Emitted when the window is closed.
  window.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    debug('closing window, windows.length =', windows.length);
    windows.splice(windows.indexOf(window), 1);
    debug('closed window, windows.length =', windows.length);
    window = null;
  });

  windows.push(window);
}

module.exports = { newWindow };
