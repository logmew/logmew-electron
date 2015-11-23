'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const LogFetcher = require('./log-fetcher');
const influx = require('influx');
const ipcMain = electron.ipcMain;
const Prefs = require('./prefs');

const prefs = Prefs.load();

// Report crashes to Electron server.
electron.crashReporter.start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;

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
  // Create the browser window.
  mainWindow = new BrowserWindow({ width: 2000, height: 2000, x: 0, y: 0 });

  // and load the index.html of the app.
  mainWindow.loadURL('file://' + __dirname + '/../browser/index.html');

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  mainWindow.webContents.on('did-finish-load', function () {
    console.log('ready');
    var influxClient = getInfluxClient();
    var logFetcher = new LogFetcher(influxClient, 1000, 10);
    logFetcher.on('data', function (data) {
      mainWindow.webContents.send('logEntries', data);
    });
    logFetcher.start();
  });

  ipcMain.on('go', function (e, j) {
    console.log(j);
  });
});

function getInfluxClient()
{
  return influx(prefs.influx);
}
