'use strict';

const debug = require('debug')('prefs-repository');
const electron = require('electron');
const app = electron.app;
const fs = require('mz/fs');
const events = require('events');
const path = require('path');
const co = require('co');
const _ = require('lodash');

class PrefsRepository extends events.EventEmitter
{
  /**
   * Constructor
   */
  constructor() {
    super()
    this.prefDir = app.getPath('userData') + '/prefs';
    this.allPrefs = {}
  }

  /**
   * Load preference
   * @param {string} name  preference name
   * @return {Promise}
   */
  load(name) {
    return new Promise((resolve, reject) => {
      debug('load');
      if (typeof this.allPrefs[name] !== 'undefined') {
        if (this.allPrefs[name] !== false) {
          return resolve(this.allPrefs[name]);
        } else {
          return reject(false);
        }
      }

      var prefPath = this.getPrefPath(name);
      debug('load from', prefPath);
      fs.readFile(prefPath, (err, data) => {
        if (err) {
          debug('PrefsRepository.load()', prefPath, err);
          this.allPrefs[name] = false;
          return reject(err);
        }
        try {
          this.allPrefs[name] = JSON.parse(data);
          resolve(this.allPrefs[name]);
        } catch (e) {
          debug('PrefsRepository.load()', prefPath, 'JSON parse', e);
          this.allPrefs[name] = false;
          return reject(err);
        }  
      });
    });
  }
  
  /**
   * Save preference
   * @param {string} name  preference name
   * @param {Hash|Array} prefs
   * @return {Promise}
   */
  save(name, prefs) {
    return new Promise((resolve, reject) => {
      debug('save', name, prefs);
      debug('mkdir', this.prefDir);
      fs.mkdir(this.prefDir, () => {
        var prefPath = this.getPrefPath(name);
        debug('save to', prefPath);
        fs.writeFile(prefPath, JSON.stringify(prefs), (err) => {
          if (err) {
            debug('PrefsRepository.save()', prefPath, err);
            return reject(err);
          }
          this.allPrefs[name] = prefs;
          this.emit('changed', { name: name, prefs: prefs });
          resolve();
        });
      });
    });
  }

  /**
   * Returns path to preference file
   * @param {string} name  preference name
   * @private
   */
  getPrefPath(name) {
    return path.join(this.prefDir, name + '.json');
  }
}

module.exports = new PrefsRepository();
