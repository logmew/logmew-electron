'use strict';

const electron = require('electron');
const app = electron.app;
const fs = require('fs');
const _ = require('lodash');

var defaultPrefs = {
  influx: {
    host: 'localhost',
    port: 8086,
    username: '',
    password: '',
    database: 'unityapp'
  }
};

class Prefs
{
  constructor () {
    this.prefPath = app.getPath('userData') + '/prefs.json';
    this.pref = false;
  }

  load () {
    if (this.pref !== false) {
      return this.pref;
    }
    try {
      this.pref = JSON.parse(fs.readFileSync(this.prefPath));
    } catch (e) {
      console.error(e);
    }
    if (!this.pref) {
      this.pref = _.clone(defaultPrefs, true);
    }
    console.log('pref', this.pref);
    return this.pref;
  }

  save () {
    if (this.pref === false) {
      return false;
    }

    try {
      writeFileSync(this.prefPath, JSON.stringify(this.pref));
      return true;
    } catch (e) {
      console.error(err);
      return false;
    }
  }
}

module.exports = new Prefs();
