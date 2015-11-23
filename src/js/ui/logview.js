'use strict';

const flight = require('flightjs');
const fastdom = require('fastdom');
const tmplRows = require('../templates/logrows.hbs');

module.exports = flight.component(component);

function component() {
  this.attributes({
  });

  this.append = function (e, data) {
    fastdom.write(() => {
      this.$node.append(tmplRows(data));
    });
  };

  this.after('initialize', function () {
    this.on(document, "dataLogEntriesServed", this.append);
  });
}
