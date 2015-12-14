'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

var window = null;

function show() {
  if (window) {
    window.focus();
    return;
  }

  window = new BrowserWindow({
    width: 480,
    height: 480,
    center: true,
    title: 'Edit Hosts - LogMew',
    acceptFirstMouse: true
  });

  window.loadURL('file://' + __dirname + '/../browser/select-host.html');
  window.webContents.openDevTools();
  window.on('closed', function() { window = null; });
}

module.exports = { show };
