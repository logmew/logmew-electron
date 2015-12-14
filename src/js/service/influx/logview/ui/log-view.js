'use strict';

const flight = require('flightjs');
const fastdom = require('fastdom');
const tmplRows = require('../templates/logrows.hbs');
const withTailScroll = require('./mixin/tail-scroll.js');
const _ = require('lodash');

module.exports = flight.component(component, withTailScroll);

function component() {
  this.prependRows = [];
  this.appendRows = [];
  this.removeCount = 0;
  this.removeRows = null;
  
  this.formatStacktrace = function (entries) {
    for (var entryIndex = 0, entryEnd = entries.length; entryIndex < entryEnd; ++entryIndex) {
      var entry = entries[entryIndex];
      if (entry.caller || !entry.stackTrace) {
        continue;
      }

      entry.caller = [];
      var lines = entry.stackTrace.split("\\n");
      for (var lineIndex = 0, lineEnd = lines.length; lineIndex < lineEnd; ++lineIndex) {
        var line = lines[lineIndex];
        var pos = line.lastIndexOf('@');
        if (!pos) {
          continue;
        }

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
  };

  this.mayRemoveAppendRows = function () {
    while (0 < this.removeCount && this.appendRows.length) {
      console.log('virtual remove', 'before', this.removeCount);
      let rows = _.first(this.appendRows);
      if (rows.length <= this.removeCount) {
        this.removeCount -= rows.length;
        this.appendRows.shift();
      } else {
        rows.find('tr:lt(' + this.removeCount + ')').remove();
        this.removeCount = 0;
      }
      
      console.log('virtual remove', 'after', this.removeCount);
    }
  };

  this.mayPrepareRemoveRows = function () {
    if (0 < this.removeCount) {
      this.removeRows = this.$node.find('tr:lt(' + this.removeCount + ')');
      console.log('prepare remove!', this.removeCount, this.removeRows.length);
    }
  };
    
  this.mayRemoveRows = function () {
    if (this.removeRows) {
      console.log('do remove', this.removeRows.length);
      this.removeCount -= this.removeRows.length;
      this.removeRows.remove();
      this.removeRows = null;
    }
  };
  
  this.mayAppendRows = function () {
    for (let i = 0, end = this.appendRows.length; i < end; ++i) {
      var rows = this.appendRows.shift();
      console.log('append', rows.length);
      rows.appendTo(this.$node)
        .find('.ui.accordion').accordion();
    }
  };
  
  this.mayPrependRows = function () {
    for (let i = 0, end = this.prependRows.length; i < end; ++i) {
      var rows = this.prependRows.shift();
      console.log('prepend', rows.length);
      rows.prependTo(this.$node)
        .find('.ui.accordion').accordion();
    }
  };
  
  this.populate = function (e, data) {
    console.log('populate', data);
    let t = new Date().getTime();
    this.formatStacktrace(data.entries);
    let rows = $(tmplRows(data));
    if (data.isBackward) {
      this.prependRows.push(rows);
    } else {
      this.appendRows.push(rows);
    }
    console.log('create time', new Date().getTime() - t);
    
    if (0 < data.removeCount) {
      this.removeCount += data.removeCount;
    }
    
    fastdom.read(() => {
      console.log('do read');
      this.mayPrepareRemoveRows();
      
      fastdom.write(() => {
        console.log('do write');
        let t = new Date().getTime();
        this.mayRemoveRows();
        this.mayRemoveAppendRows();
        this.mayAppendRows();
        this.mayPrependRows();

        if (data.isViewBottom) {
          this.scrollToBottom();
        }
        setTimeout(() => console.log('count', this.$node.find('tr').length), 0);
        console.log('write time', new Date().getTime() - t);
      });
    });
  };

  this.after('initialize', function () {
    this.on(document, "ui.log.newentries%", this.populate);
  });
}
