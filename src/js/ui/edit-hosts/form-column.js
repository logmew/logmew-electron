'use strict';

const flight = require('flightjs');
const fastdom = require('fastdom');

module.exports = flight.component(component);

function component() {
  this.attributes({
    // common form
    commonFormSelector: '.common.form',
    idSelector: '.common.form :input[name="id"]',
    nameSelector: '.common.form :input[name="name"]',
    typeSelector: '.common.form :input[name="type"]',
    inputSelector: ':input',

    // service form
    serviceFormSelector: '.service.form'
  });

  /**
   * Populate input form
   * @param {hash} entry
   */
  this.populate = function (e, data) {
    this.trigger(this.select('serviceFormSelector'), 'ui.prefs.hosts.service.populate!', data);

    fastdom.read(() => {
      let $id = this.select('idSelector');
      let $name = this.select('nameSelector');
      let $type = this.select('typeSelector');
      fastdom.write(() => {
        $id.val(data.id);
        $name.val(data.name).focus()[0].select();
        $type.val(data.type);
      });
    });
  };

  /**
   * clear form
   */
  this.clear = function (e) {
    fastdom.read(() => {
      let $id = this.select('idSelector');
      let $name = this.select('nameSelector');
      let $type = this.select('typeSelector');
      let $serviceForm = this.select('serviceFormSelector');
      fastdom.write(() => {
        $id.val('');
        $name.val('');
        $type.val('');
        $serviceForm.empty();
      });
    });
  };
  
  /**
   * Input handler, request other ui to apply the form contents
   */
  this.onInput = function () {
    this.trigger('ui.prefs.hosts.form.apply!', this.serializeForms());
  };

  this.serializeForms = function () {
    let entry = { setting: {} };

    // common
    this.select('commonFormSelector').serializeArray().forEach(function (input) {
      entry[input.name] = input.value;
    });
    this.select('serviceFormSelector').serializeArray().forEach(function (input) {
      entry.setting[input.name] = input.value;
    });

    return entry;
  };

  this.after('initialize', function () {
    this.on(document, 'ui.prefs.hosts.form.populate!', this.populate);
    this.on(document, 'ui.prefs.hosts.form.clear!', this.clear);
    this.on('input', { inputSelector: this.onInput });
  });
}
