'use strict';

const debug = require('debug')('prefs-hosts');
const repo = require('./prefs-repository');

const PREF_NAME = 'hosts';

var defaultPrefs = {
  hosts: []
};

module.exports = {
  load: function () {
    debug('load');
    return new Promise((resolve, reject) => {
      repo.load(PREF_NAME)
        .then(function (prefs) { resolve(prefs); },
              function (err) { debug(err); resolve(defaultPrefs); });
    });
  },

  save: function (prefs) {
    debug('save');
    if (!prefs || !prefs.hosts) {
      debug('invalid data', prefs);
      return new Promise(function (resolve, reject) { reject('invalid data'); });
    }
    return repo.save(PREF_NAME, prefs);
  },

  get: function (id) {
    return this.load()
      .then(function (prefs) {
        for (let i = 0, end = prefs.hosts.length; i < end; ++i) {
          if (prefs.hosts[i].id === id) {
            return prefs.hosts[i];
          }
        }
      });
  }
}
