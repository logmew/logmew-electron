'use strict';

require('jquery/dist/jquery.min');
require('semantic/dist/semantic.min.css');
require('semantic/dist/semantic.min');
require('css/main.scss');
require('jquery/jquery.imeenter');

var flight = require('flightjs');
//flight.debug.events.logAll();
//flight.debug.enable(true);
//flight.compose.mixin(flight.registry, [flight.advice.withAdvice, flight.logger]);

require('./boot/boot');
