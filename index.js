'use strict';

const influx = require('influx');
const moment = require('moment');

const client = influx({
  host : 'localhost',
  port: 8086,
  username: 'user',
  password: 'pass',
  database: 'unityapp',
});

class LogFetcher
{
  constructor (client, period, limit) {
    this.client = client;
    this.period = period || 1000;
    this.limit = limit || 100;
    this.timeGreaterThan = null;
  }

  start () {
    this.timeGreaterThan = null;
    this.queryEvents();
  }

  queryEvents () {
    var query = 'SELECT * FROM events';
    if (this.timeGreaterThan) {
      query += " WHERE time > '" + this.timeGreaterThan + "'";
    }
    query += " LIMIT " + this.limit;

    this.client.query(query, this.onResult.bind(this));
  }

  onResult (err, results) {
    if (err) {
      console.error(err);
    }
    var entries = results && results[0];
    if (!entries || !entries.length) {
      // nothing new
      setTimeout(this.queryEvents.bind(this), this.period);
    } else {
      entries.forEach(function (entry) {
        var timestamp = moment(entry.time);
        console.log(entry[0], timestamp.format('YYYY-MM-DD HH:mm:ss.SSS'));
      });
      this.timeGreaterThan = entries[entries.length - 1].time;
      setTimeout(this.queryEvents.bind(this), (entries.length == this.limit) ? 1 : this.period);
    }
  }
}

var fetcher = new LogFetcher(client, 1000, 10);
fetcher.start();
