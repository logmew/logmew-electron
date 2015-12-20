'use strict';

require('jquery/dist/jquery.min');
require('semantic/dist/semantic.min.css');
require('semantic/dist/semantic.min');
require('css/log-influx.scss');
require('jquery/jquery.imeenter');

var flight = require('flightjs');
//flight.debug.events.logAll();
//flight.debug.enable(true);
//flight.compose.mixin(flight.registry, [flight.advice.withAdvice, flight.logger]);

require('js/service/influx/logview/data/ipc-renderer.js').attachTo(document);
require('js/service/influx/logview/ui/header-menu.js').attachTo('#header-menu');
require('js/service/influx/logview/ui/search.js').attachTo('#header-menu .ui.search');
require('js/service/influx/logview/ui/log-controller.js').attachTo(document);
require('js/service/influx/logview/ui/log-view.js').attachTo('#logview');
