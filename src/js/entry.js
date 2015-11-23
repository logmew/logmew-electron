'use strict';

require('../components/jquery/dist/jquery.min');
require('../components/semantic/dist/semantic.min.css');
require('../components/semantic/dist/semantic.min');
require('../css/main.scss');
require('../jquery/jquery.imeenter');

var flight = require('flightjs');
//flight.debug.events.logAll();
//flight.debug.enable(true);
//flight.compose.mixin(flight.registry, [flight.advice.withAdvice, flight.logger]);

require('./boot/boot');
