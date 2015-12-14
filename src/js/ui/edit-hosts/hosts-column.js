'use strict';

const flight = require('flightjs');
const fastdom = require('fastdom');
const uuid = require('uuid');
const tmplHosts = require('../../templates/hosts-column-hosts-list.hbs');

module.exports = flight.component(component);

function component() {
  this.attributes({
    // add host
    addItemSelector: '.add.button',
    hostTypeSelector: '.hosts.selection :selected',

    // host list action
    removeItemSelector: '.remove.item',
    copyItemSelector: '.copy.item',

    // host list
    dropdownSelector: '.ui.dropdown',
    listSelector: '.ui.vertical.menu',
    hostItemSelector: '.ui.vertical.menu a',
    selectedItemSelector: '.ui.vertical.menu a.active',
  });

  this.initial = true;
  
  /**
   * Cached preference data, sent from the app host
   */
  this.cachedData = { hosts: [] };

  /**
   * Cache hosts preference, sent from the app host
   * @param {Event} e
   * @param {hash} data
   */
  this.cacheData = function (e, data) {
    this.cachedData = data;
  };

  /**
   * Populate host settings list, with this.cachedData
   */
  this.populateHosts = function () {
    return new Promise((resolve) => {
      let html = tmplHosts(this.cachedData);
      fastdom.read(() => {
        let $list = this.select('listSelector');
        let $removeItem = this.select('removeItemSelector');
        let $copyItem = this.select('copyItemSelector');

        fastdom.write(() =>  {
          $list.empty().append(html);
          $removeItem.addClass('disabled');
          $copyItem.addClass('disabled');
          if (this.initial) {
            this.initial = false;
            setTimeout(() => { this.select('hostItemSelector').first().click(); }, 0);
          }
          resolve();
        });
      });
    });
  };

  this.populateForm = function (entry) {
    this.trigger('ui.prefs.hosts.form.populate!', entry);
  };

  this.applyForm = function (e, data) {
    let index = this.cachedData.hosts.findIndex(function (entry) {
      return entry.id === data.id;
    });
    if (index === undefined) {
      console.error('setting not found', data);
      return;
    }

    // Apply new setting name to the match item in the hosts list
    if (this.cachedData.hosts[index].name !== data.name) {
      this.$node.find(`a[data-id="${data.id}"]`).text(data.name);
    }

    this.cachedData.hosts[index] = data;
    this.applyPrefs();
  };
  
  /**
   * Click handler, `add` button is clicked
   * @param {Event} e
   */
  this.onAddItemClick = function (e) {
    this.trigger('data.prefs.hosts.service.add!', {
      id: uuid.v4(),
      name: this.generateName('new host'),
      type: this.select('hostTypeSelector').val(),
      setting: {}
    });
  };

  this.onAddService = function (e, data) {
    this.cachedData.hosts.push(data);
    this.trigger('data.prefs.hosts.set!', this.cachedData);
    this.populateHosts()
      .then(() => {
        this.select('hostItemSelector').last().click();
      });
  };
    
  /**
   * Click handler, on one of host items is clicked
   * @param {Event} e
   */
  this.onHostItemClick = function (e) {
    var index = $(e.currentTarget).prevAll('a').length;
    if (index < this.cachedData.hosts.length) {
      var entry = this.cachedData.hosts[index];
      this.select('hostItemSelector')
        .removeClass('active')
        .eq(index).addClass('active');
      this.select('removeItemSelector').removeClass('disabled');
      this.select('copyItemSelector').removeClass('disabled');

      this.populateForm(entry);
    }
  };

  /**
   * Click handler, `remove` button is clicked
   * @param {Event} e
   */
  this.onRemoveItemClick = function (e) {
    let selectedItem = this.select('selectedItemSelector');
    if (!selectedItem.length) return;

    let index = selectedItem.prevAll('a').length;
    this.cachedData.hosts.splice(index, 1);
    this.applyPrefs();

    if (!this.cachedData.hosts[index]) {
      --index;
    }

    this.populateHosts()
      .then(() => {
        let item = this.select('hostItemSelector').eq(index);
        if (item.length) {
            item.click();
        } else {
          this.trigger('ui.prefs.hosts.form.clear!');
        }
      });
  };

  /**
   * Click handler, `copy` button is clicked
   * @param {Event} e
   */
  this.onCopyItemClick = function (e) {
    let selectedItem = this.select('selectedItemSelector');
    if (!selectedItem.length) return;

    let index = selectedItem.prevAll('a').length;
    let entry = Object.assign({}, this.cachedData.hosts[index]);
    entry.id = uuid.v4();
    let baseName = entry.name.replace(/\s*\d+$/, '');
    entry.name = this.generateName(baseName);

    this.cachedData.hosts.push(entry);
    this.applyPrefs();

    this.populateHosts()
      .then(() => {
        this.select('hostItemSelector').last().click();
      });
  };

  /**
   * Generate setting name
   * @param {string} baseName
   */
  this.generateName = function (baseName) {
    let re = new RegExp(baseName + '\\s*(\\d*)$');
    let hosts = this.cachedData.hosts;
    let num = false;
    for (let i = 0, end = hosts.length; i < end; ++i) {
      let match = re.exec(hosts[i].name);
      if (match) {
        if (match[1]) {
          num = Math.max(num, parseInt(match[1]));
        } else {
          num = 0;
        }
      }
    }
    if (num !== false) {
      return baseName + (num + 1);
    } else {
      return baseName;
    }
  };
  
  /**
   * Apply form values and send updated preference to the app host
   */
  this.applyPrefs = function () {
    this.trigger('data.prefs.hosts.set!', this.cachedData);
  };

  this.after('initialize', function () {
    this.on(document, 'data.prefs.hosts.get%', this.cacheData);
    this.on(document, 'data.prefs.hosts.get%', this.populateHosts);

    this.on(document, 'data.prefs.hosts.service.add%', this.onAddService);
    this.on(document, 'ui.prefs.hosts.form.apply!', this.applyForm);

    this.on('click', { hostItemSelector: this.onHostItemClick,
                       addItemSelector: this.onAddItemClick,
                       removeItemSelector: this.onRemoveItemClick,
                       copyItemSelector: this.onCopyItemClick });
    
    this.select('dropdownSelector').dropdown();
    this.select('removeItemSelector').popup({ position: 'bottom left' });
    this.select('copyItemSelector').popup({ position: 'bottom left' });

    this.trigger('data.prefs.hosts.get!');
  });

}
