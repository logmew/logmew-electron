'use strict';

const flight = require('flightjs');
const $ = require('jQuery');
const fastdom = require('fastdom');
const tmplRows = require('../templates/logrows.hbs');

module.exports = flight.component(component);

function component() {
  this.attributes({
  });

  this.append = function (e, data) {
    data.logEntries.forEach(function (entry) {
      if (!entry.caller && entry.stackTrace) {
        entry.caller = entry.stackTrace.split("\\n").map(function (line) {
          var pos = line.lastIndexOf('@');
          if (pos) {
            return {
              method: line.substr(0, pos),
              file: line.substr(pos + 1).trim()
            };
          }
        });
        entry.callerTop = entry.caller.shift();
      }
    });
    fastdom.write(() => {
      var rows = tmplRows(data);
      this.$node.append(rows).find('.ui.accordion').accordion();
    });
  };

  this.after('initialize', function () {
    this.on(document, "dataLogEntriesServed", this.append);
  });
}
