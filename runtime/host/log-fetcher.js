'use strict';

const ipcMain = require('electron').ipcMain;
const events = require('events');

module.exports =
class LogFetcher extends events.EventEmitter
{
  constructor (client, period, limit) {
    super();
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
      this.emit('data', { logEntries: entries });
      entries.forEach(function (entry) {
        //var timestamp = moment(entry.time);
        //console.log(timestamp.format('YYYY-MM-DD HH:mm:ss.SSS'));
      });
      this.timeGreaterThan = entries[entries.length - 1].time;
      setTimeout(this.queryEvents.bind(this), (entries.length == this.limit) ? 1 : this.period);
    }
  }
}
