'use strict';

const electron = require('electron');
const app = electron.app;
const fs = require('fs');
const events = require('events');
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

class Prefs extends events.EventEmitter
{
  constructor () {
    super()
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
    return this.pref;
  }

  save (pref) {
    if (!pref) {
      return false;
    }

    try {
      fs.writeFileSync(this.prefPath, JSON.stringify(pref));
      this.pref = pref;
      this.emit('changed', this.pref);
      return true;
    } catch (e) {
      return false;
    }
  }
}

module.exports = new Prefs();
