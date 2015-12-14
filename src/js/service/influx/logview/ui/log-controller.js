'use strict';

const flight = require('flightjs');
const _ = require('lodash');

module.exports = flight.component(component);

function component() {
  // to prevent to send duplicated request
  this.requestedFetchLogBackward = false;

  this.observing = false;
  this.isViewBottom = true;

  this.maxDisplayCount = 300;
  this.displayEntries = [];
  this.paused = false;
  this.pendingEntries = [];

  /**
   * Fetch log
   * @param {bool} backward
   * @note It ignores duplicated request
   */
  this.fetchLog = function (backward) {
    var criteria = {
      backward: backward,
      limit: 100
    };

    if (backward) {
      if (this.requestedFetchLogBackward) return;
      this.requestedFetchLogBackward = true;

      if (!this.paused) {
        this.pause();
      }

      if (this.displayEntries.length) {
        criteria.baseTime = _.first(this.displayEntries).time;
      }
    } else {
      if (this.requestedFetchLogForward) return;
      this.requestedFetchLogForward = true;

      if (this.paused) {
        this.resume();
      }

      if (this.displayEntries.length) {
        criteria.baseTime = _.last(this.displayEntries).time;
      }
    }

    this.trigger('data.log.fetch!', criteria);
  };

  /**
   * Pause log view updating
   */
  this.pause = function () {
    this.paused = true;
    this.trigger('ui.log.paused%');
  };

  /**
   * Resume log view updating
   */
  this.resume = function () {
    console.log('resume');
    this.paused = false;
    this.trigger('ui.log.resumed%');
    if (this.pendingEntries.length === 0) {
      return;
    }

    var updateData = {
      backward: false,
      removeCount: 0,
      entries: data.entries
    };

    if (this.maxDisplayCount <= this.pendingEntries.length) {
      this.displayEntries = this.pendingEntries.slice(this.pendingEntries.length - this.maxDisplayCount);
      updateData.removeCount = this.maxDisplayCount;
      updateData = this.displayEntries;
    } else {
      updateData.removeCount = this.displayEntries.length + this.pendingEntries.length - this.maxDisplayCount;
      if (updateData.removeCount <= 0) {
        updateData.removeCount = 0;
      } else {
        this.displayEntries.splice(0, updateData.removeCount);
        this.displayEntries = this.displayEntries.concat(this.pendingEntries);
      }
    }
    this.pendingEntries = [];

    this.trigger('ui.log.newentries%', updateData);
  };

  /**
   * Called when the system fetched log entries.
   * @param {hash} data
   */
  this.onFetchLog = function (e, data) {
    if (!this.observing) {
      this.observing = true;
      this.trigger('data.log.observe!', {
        limit: 100
      });
    }

    if (this.requestedFetchLogBackward && data.backward) {
      this.requestedFetchLogBackward = false;
    }

    if (this.paused && !data.backward) {
      // log observer sent new incoming log entries.
      // While it is `pause` state, append them to `this.pendingEntries`
      this.pendingEntries = this.pendingEntries.concat(data.entries);
      return;
    }

    var updateData = {
      backward: data.backward,
      removeCount: 0,
      entries: data.entries,
      isViewBottom: this.isViewBottom
    };

    if (data.backward) {
      this.displayEntries = data.entries.concat(this.displayEntries);
    } else {
      updateData.removeCount = this.displayEntries.length + data.entries.length - this.maxDisplayCount;
      if (updateData.removeCount <= 0) {
        updateData.removeCount = 0;
      } else {
        this.displayEntries.splice(0, updateData.removeCount);
      }
      this.displayEntries = this.displayEntries.concat(data.entries);
    }

    this.trigger('ui.log.newentries%', updateData);
  };

  this.onFetchLogError = function (e, data) {
    if (this.requestedFetchLogBackward && data.backward) {
      this.requestedFetchLogBackward = false;
    }
  };

  /**
   * Observe scrollY position
   */
  this.observeScroll = function () {
    var lastY = 0;
    $(window).scroll(() => {
      var curY = window.scrollY;
      var goesDown = 0 < curY - lastY;
      lastY = curY;

      if (goesDown) {
        var body = document.body;
        if ((body.scrollHeight - body.offsetHeight) <= window.scrollY) {
          this.isViewBottom = true;
          if (this.paused) {
            this.resume();
          }
        }
      } else {
        this.isViewBottom = false;
        if (curY === 0) {
          this.fetchLog(true);
        }
      }
    });
  };

  this.after('initialize', function () {
    this.observeScroll();

    this.on('data.log.fetch%', this.onFetchLog);
    this.on('data.log.fetch~', this.onFetchLogError);
    this.on('data.log.newentries%', this.onFetchLog);

    console.log('START');
    this.trigger('data.log.fetch!', {
      backward: true,
      limit: 100
    });
  });
}
