'use strict';

const flight = require('flightjs');
const fastdom = require('fastdom');
const tmplForm = require('./form.hbs');

module.exports = flight.component(component);

function component() {
  this.active = false;

  /**
   * Populate input form
   * @param {hash} entry
   */
  this.populateForm = function (e, data) {
    console.log('populateForm');
    this.active = (data.type === 'InfluxDB');
    if (!this.active) return;

    let html = tmplForm(data.setting);
    fastdom.write(() => {
      this.$node.empty().append(html);
    });
  };

  this.after('initialize', function () {
    this.on('ui.prefs.hosts.service.populate!', this.populateForm);
  });
}
