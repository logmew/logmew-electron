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
    width: 900,
    height: 800,
    center: false,
    title: 'Edit Hosts - LogMew',
    acceptFirstMouse: true
  });

  window.loadURL('file://' + __dirname + '/../browser/edit-hosts.html');
  window.webContents.openDevTools();
  window.on('closed', function() { window = null; });
}

module.exports = { show };
