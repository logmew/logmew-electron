'use strict';

const debug = require('debug')('influx/log-fetcher');
const events = require('events');
const util = require('util');
const influx = require('influx');

module.exports =
class LogFetcher
{
  /**
   * @constructor
   * @param {string} connectionName, InfluxDB connection preference name
   */
  constructor(pref) {
    this.pref = pref;
    this.client = null;
  }

  /**
   * Fetch logs
   * @param {hash} criteria
   * <pre>
   *   [key]      [type]     [description]
   *   backward:  bool       search direction
   *   baseTime:  int|string base time used in search
   *   limit:     int        max number of fetch rows
   * </pre>
   * @return {Promise}
   */
  fetch(criteria) {
    return new Promise((resolve, reject) => {
      var query = 'SELECT * FROM events WHERE';

      var baseTime;
      if (typeof criteria.baseTime === 'string') {
          baseTime = `'${criteria.baseTime}'`;
      } else if (criteria.baseTime) {
        baseTime = criteria.baseTime;
      } else {
        baseTime = 'now()';
      }

      if (criteria.backward) {
        if (baseTime) {
          query += ` time < ${baseTime}`
        }
        query += " ORDER BY time DESC";
      } else {
        if (baseTime) {
          query += ` ${baseTime} < time`
        }
        query += " ORDER BY time ASC";
      }

      const limit = criteria.limit || 100;
      query += ` LIMIT ${limit}`;

      let client = this.getClient()
      debug('query', query);
      client.query(query, (error, results) => {
        if (error) {
          return reject({ error, connectionName: this.connectionName });
        }

        var entries = results && results[0];
        if (!entries) {
          return reject({ error: 'format error', connectionName: this.connectionName });
        }

        debug('found length', entries.length);
        if (criteria.backward) {
          entries = entries.reverse();
        }
        resolve({ entries, backward: !!criteria.backward });
      });
    });
  }

  /**
   * Get InfluxDB client
   * @param {string} InfluxDB preference name
   * @return {Promise}
   * @private
   */
  getClient() {
    if (this.client) {
      return this.client;
    } else {
      this.client = influx(this.pref.setting);
      return this.client;
    }
  }
}
