'use strict';

const flight = require('flightjs');

module.exports = flight.component(component);

function component() {
  this.attributes({
    hostField: ':input[name="host"]',
    portField: ':input[name="port"]',
    usernameField: ':input[name="username"]',
    passwordField: ':input[name="password"]',
    databaseField: ':input[name="database"]',
  });

  this.queryPref = function (e) {
    this.trigger('dataPrefRequested');
  };

  this.showPreference = function (e, data) {
    var influx = data.influx;
    this.select('hostField').val(influx.host);
    this.select('portField').val(influx.port);
    this.select('usernameField').val(influx.username);
    this.select('passwordField').val(influx.password);
    this.select('databaseField').val(influx.database);
    this.$node
      .modal({ onApprove: () => { this.onApprove(); return true } })
      .modal('show');
  };

  this.onApprove = function (e) {
    var pref = {
      influx: {
        host: this.select('hostField').val(),
        port: this.select('portField').val(),
        username: this.select('usernameField').val(),
        password: this.select('passwordField').val(),
        database: this.select('databaseField').val(),
      }
    };
    this.trigger('dataUpdatePrefRequested', { pref } );
    return false;
  };

  this.after('initialize', function () {
    this.on(document, 'uiShowPreferenceRequested', this.queryPref);
    this.on(document, 'dataPrefServed', this.showPreference);
  });
}
