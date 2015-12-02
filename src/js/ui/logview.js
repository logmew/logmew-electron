'use strict';

const flight = require('flightjs');
const fastdom = require('fastdom');
const tmplRows = require('../templates/logrows.hbs');
const withTailScroll = require('./mixin/tail-scroll.js');

module.exports = flight.component(component, withTailScroll);

function component() {
  this.attributes({
    tr: 'tr'
  });

  this.maxLogCount = 300;
  this.logCount = 0;

  this.append = function (e, data) {
    data.logEntries.forEach(function (entry) {
      if (!entry.caller && entry.stackTrace) {
        entry.caller = [];
        var lines = entry.stackTrace.split("\\n");
        for (var i = 0, end = lines.length; i < end; ++i) {
          var line = lines[i];
          var pos = line.lastIndexOf('@');
          if (pos) {
            var info = {
              method: line.substr(0, pos),
              file: line.substr(pos + 1).trim()
            };
            if (!entry.callerTop) {
              entry.callerTop = info;
            } else {
              entry.caller.push(info);
            }
          }
        }
      }
    });

    var wasScrolledBottom = this.logCount == 0 || this.isScrolledBottom();
    this.logCount += data.logEntries.length;

    var removeCount = this.logCount - this.maxLogCount;
    if (0 < removeCount) {
      this.logCount = this.maxLogCount;
      this.$node.find('tr:lt(' + removeCount + ')').remove();
    }

    var rows = tmplRows(data);
    $(rows)
      .appendTo(this.$node)
      .find('.ui.accordion').accordion();

    if (wasScrolledBottom) {
      this.scrollToBottom();
    }
  };

  this.after('initialize', function () {
    this.on(document, "dataLogEntriesServed", this.append);
  });
}
