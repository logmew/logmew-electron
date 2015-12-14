'use strict';

const flight = require('flightjs');
const fastdom = require('fastdom');
const tmplHosts = require('../../templates/hosts-list.hbs');

module.exports = flight.component(component);

function component() {
  this.attributes({
    itemSelector: 'a.item'
  });

  /**
   * Populate list with InfluxDB hosts preference
   * @param {Event} e
   * @param {hash} data
   */
  this.populate = function (e, data) {
    this.cachedData = data;
    
    let html = tmplHosts(data);

    fastdom.write(() => {
      this.$node.empty().append(html);
    });
  };

  this.onItemClicked = function (e) {
    let id = $(e.currentTarget).data('id');
    let type = $(e.currentTarget).find('.label').text();
    if (id) {
      this.trigger('data.window.logview.open!', { id, type });
    }
  };

  this.after('initialize', function () {
    this.on(document, 'data.prefs.hosts.get%', this.populate);
    this.on(document, 'data.prefs.hosts.set%', this.populate);
    this.on('click', { itemSelector: this.onItemClicked });
    this.trigger('data.prefs.hosts.get!');
  });
}
