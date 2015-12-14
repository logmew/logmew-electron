'use strict';

require('jquery/dist/jquery.min');
require('semantic/dist/semantic.min.css');
require('css/select-host.scss');

var flight = require('flightjs');
//flight.debug.events.logAll();
//flight.debug.enable(true);
//flight.compose.mixin(flight.registry, [flight.advice.withAdvice, flight.logger]);

require('js/data/ipc-renderer').attachTo(document);
require('js/ui/select-host/hosts-list').attachTo('.vertical.menu');
require('js/ui/select-host/editor-button').attachTo('.button');

// service
// FIXME make them like plugin
require('js/service/influx/edit-hosts/data.js').attachTo(document);
