'use strict';

require('jquery/dist/jquery.min');
require('semantic/dist/semantic.min.css');
require('semantic/dist/semantic.min');
require('css/edit-hosts.scss');
require('jquery/jquery.imeenter');

var flight = require('flightjs');
//flight.debug.events.logAll();
//flight.debug.enable(true);
//flight.compose.mixin(flight.registry, [flight.advice.withAdvice, flight.logger]);

require('js/data/ipc-renderer').attachTo(document);
require('js/ui/edit-hosts/hosts-column').attachTo('.hosts.column');
require('js/ui/edit-hosts/form-column').attachTo('.form.column');
require('js/ui/edit-hosts/page').attachTo('body');

// service
// FIXME make them like plugin
require('js/service/influx/edit-hosts/form.js').attachTo('.service.form');
require('js/service/influx/edit-hosts/data.js').attachTo(document);
