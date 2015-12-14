'use strict';

const debug = require('debug')('influx/log-observer');
const events = require('events');
const LogFetcher = require('./log-fetcher');

const MAX_RETRY_WAITTIME = 60 * 1000;

module.exports =
class LogObserver extends events.EventEmitter
{
  /**
   * @constructor
   * @param {string} connectionName, InfluxDB connection preference name
   */
  constructor(pref) {
    super();
    this.fetcher = new LogFetcher(pref);
    this.timerId = null;
  }

  /**
   * Stop observing
   * @param {hash} criteria
   * <pre>
   *   [key]      [type]  [description]
   *   baseTime:  int     base time used in search
   *   period:    int     polling period in mili-seconds
   *   limit:     int     max number of fetch rows
   * </pre>
   * @return {Promise}
   */
  start(criteria) {
    debug('start', criteria);
    this.stop();

    this.criteria = {
      baseTime: criteria.baseTime || (new Date()).getTime() * 1000000,
      limit:  criteria.limit || 100
    };
    debug('start2', this.criteria);
    this.period = criteria.period || 1000;
    this.retryWaitTime = this.period;
    return this.queryEvents();
  }

  /**
   * Stop observing
   */
  stop() {
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  /**
   * Send query to InfluxDB
   * @return {Promise}
   * @private
   */
  queryEvents() {
    return this.fetcher.fetch(this.criteria)
      .then(
        // Promise.resolve
        (data) => {
          var entries = data.entries
          if (entries.length) {
            this.emit('data', data);
            this.criteria.baseTime = entries[entries.length - 1].time;
          }

          var timeout = (entries.length == this.criteria.limit) ? 1 : this.period;
          this.timerId = setTimeout(this.queryEvents.bind(this), timeout);
        },
        // Promise.reject
        (error) => {
          this.retryWaitTime = Math.min(this.retryWaitTime * 2, MAX_RETRY_WAITTIME);
          this.timerId = setTimeout(this.queryEvents.bind(this), this.retryWaitTime);
          this.emit('error', {
            connectionName: this.fetcher.connectionName,
            error
          });
        });
  }
}
