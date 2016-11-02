var express = require('express');
var api = express.Router();
var mongoose = require('mongoose');
var middleware = require('../modules/middleware');

var flightApiGet = require('./api/get');
var flightApiPost = require('./api/post');
var flightApiSingleGet = require('./api/single-get');

api.get('/flights', flightApiGet);
api.get('/flight/:id', flightApiSingleGet);
api.post('/flight', middleware.signedInOnly, flightApiPost);

var flightInfoApiPost = require('./api/flight-info');
api.post('/flight-info', middleware.signedInOnly, flightInfoApiPost);

var turnpointsApiGet = require('./api/turnpoints');
api.get('/turnpoints', turnpointsApiGet);

var statsApiGet = require('./api/stats');
api.get('/stats/:year?', statsApiGet);

module.exports = api;
