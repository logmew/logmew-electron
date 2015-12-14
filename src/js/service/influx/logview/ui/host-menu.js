'use strict';

const flight = require('flightjs');
const fastdom = require('fastdom');
const tmplMenu = require('../templates/hosts-dropdown.hbs');

module.exports = flight.component(component);

function component() {
  this.attributes({
    hostsMenuSelector: '.hosts.menu',
    hostItemSelector: 'a.host.item',
    settingItemSelector: 'a.setting.item'
  });

  this.cachedData = { hosts: [] };

  /**
   * Populate menu with InfluxDB hosts preference
   * @param {Event} e
   * @param {hash} data
   */
  this.populate = function (e, data) {
    this.cachedData = data;

    let html = tmplMenu(this.cachedData);
    fastdom.read(() => {
      let hostsMenu = this.select('hostsMenuSelector');
      fastdom.write(() => {
        hostsMenu.empty().append(html);
        this.$node.dropdown();
      });
    });
  };

  /**
   * Click handler, host selected
   * @param {Event} e
   */
  this.onHostItemClick = function (e) {
    this.select('hostItemSelector').removeClass('active');
    let selectedItem = $(e.currentTarget);
    selectedItem.addClass('active');
    let index = selectedItem.prevAll('a').length;
    for (let i = 0, end = this.cachedData.hosts.length; i < end; ++i) {
      this.cachedData.hosts[i].selected = (i === index);
    }
    this.trigger('data.prefs.influx.set!', this.cachedData);
    //this.trigger('ui.prefs.influx.hosts.changed%');
  };

  /**
   * Click handler, show modal
   * @param {Event} e
   */
  this.showSettingModalClick = function (e) {
    e.preventDefault();
    this.trigger('ui.pref.influxdb.show!');
  };

  /**
   * Request to get preference
   */
  this.requestInfluxDbPrefs = function () {
    this.trigger('data.prefs.influx.get%');
  };

  this.after('initialize', function () {
    this.on(document, 'data.prefs.influx.get%', this.populate);
    this.on(document, 'data.prefs.influx.set%', this.populate);
    this.on('click', { hostItemSelector: this.onHostItemClick,
                       settingItemSelector: this.showSettingModalClick });
  });
}
