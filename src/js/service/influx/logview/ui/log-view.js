'use strict';

const flight = require('flightjs');
const fastdom = require('fastdom');
const tmplRows = require('../templates/logrows.hbs');
const _ = require('lodash');

module.exports = flight.component(component);

function component() {
  this.attributes({
    accordionSelector: '.stacktrace thead td',
  });

  this.prependRows = [];
  this.appendRows = [];
  this.removeCount = 0;
  this.removeRows = null;

  this.onClearLog = function () {
    this.prependRows = [];
    this.appendRows = [];
    this.removeCount = 0;
    this.removeRows = null;
    fastdom.write(() => {
      this.$node.empty();
    });
  };

  this.isScrolledBottom = function () {
    let tbody = this.$node[0];
    return tbody.scrollHeight <= (tbody.clientHeight + tbody.scrollTop);
  };

  this.scrollToTop = function () {
    let tbody = this.$node[0];
    tbody.scrollTop = 0;
  };

  this.scrollToBottom = function () {
    let tbody = this.$node[0];
    tbody.scrollTop = tbody.scrollHeight;
  };

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
      this.mayPrepareRemoveRows();

      fastdom.write(() => {
        let t = new Date().getTime();
        this.mayRemoveRows();
        this.mayRemoveAppendRows();
        this.mayAppendRows();
        this.mayPrependRows();

        console.log('pop', data.isViewBottom);
        if (data.isViewBottom) {
          this.scrollToBottom();
        }
        console.log('write time', new Date().getTime() - t);
      });
    });
  };

  this.buildFilterPattern = function (data) {
    let query = data.regexp ? data.query : _.escapeRegExp(data.query);

    let flags = '';
    if (!data.caseSensitive) {
      flags += 'i';
    }
    if (data.word && !data.regexp) {
      query = "\\b" + query + "\\b";
    }

    return new RegExp(query, flags);
  };

  this.filter = function (e, data) {
    let pattern = this.buildFilterPattern(data);

    fastdom.read(() => {
      let $tr = this.$node.find('.tr');
      for (let i = 0, end = $tr.length; i < end; ++i) {
        let tr = $tr[i];
        let origin = tr.dataset.origin
        let message = tr.dataset.message;
        if (!pattern.test(origin) && !pattern.test(message)) {
          if (tr.style.display != "none") {
            fastdom.write(function () { tr.style.display = "none"; });
          }
        } else {
          let htmlOrigin = this.generateHighlightHtml(origin, pattern);
          let htmlMessage = this.generateHighlightHtml(message, pattern);
          fastdom.write(function () {
            if (tr.style.display != "flex") {
              tr.style.display = "flex";
            }
            // origin
            tr.children[2].innerHTML = htmlOrigin;
            // message
            tr.children[3].children[0].innerHTML = htmlMessage;
          });

        }
      }
    });
  };

  this.generateHighlightHtml = function (haystack, pattern) {
    let start = 0;
    let html = '';
    haystack.replace(pattern, function (match, offset, q) {
      html += _.escape(haystack.substr(start, offset - start));
      html += '<span class="highlight">' + _.escape(match) + '</span>';
      start = offset + match.length;
    });
    if (start < haystack.length) {
      html += _.escape(haystack.substr(start));
    }
    return html;
  };

  this.clearFilter = function (e) {
    fastdom.read(() => {
      let $tr = this.$node.find('.tr');
      for (let i = 0, end = $tr.length; i < end; ++i) {
        let tr = $tr[i];
        fastdom.write(function () {
          if (tr.style.display != 'flex') {
            tr.style.display = "flex";
          }
          // origin
          tr.children[2].innerHTML = tr.dataset.origin;
          // message
          tr.children[3].children[0].innerHTML = tr.dataset.message;
        })
      }
    });
  };

  this.onAccordionClick = function (e) {
    fastdom.read(() => {
      var $stacktrace = $(e.currentTarget).closest('table.stacktrace')
      console.log($stacktrace[0]);
      fastdom.write(() => {
        $stacktrace.toggleClass('active');
      });
    });
  };

  this.after('initialize', function () {
    this.on(document, "ui.log.newentries%", this.populate);
    this.on(document, 'ui.log.filter!', this.filter);
    this.on(document, 'ui.log.filter.clear!', this.clearFilter);
    this.on(document, 'ui.log.clear!', this.onClearLog);
    this.on('click', { accordionSelector: this.onAccordionClick });
  });
}
