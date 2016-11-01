var express = require('express');
var api = express.Router();
var mongoose = require('mongoose');
var middleware = require('../modules/middleware');

var flightApiGet = require('./api/get');
var flightApiPost = require('./api/post');
var flightApiSingleGet = require('./api/single-get');
var flightApiPut = require('./api/put');
var flightApiDelete = require('./api/delete');

api.get('/flights', flightApiGet);
api.get('/flight/:id', flightApiSingleGet);
api.post('/flight', middleware.signedInOnly, flightApiPost);
api.put('/flight/:id', middleware.signedInOnly, flightApiPut);
api.delete('/flight/:id', middleware.signedInOnly, flightApiDelete);


var flightInfoApiPost = require('./api/flight-info');
api.post('/flight-info', middleware.signedInOnly, flightInfoApiPost);

var turnpointsApiGet = require('./api/turnpoints');
api.get('/turnpoints', turnpointsApiGet);

module.exports = api;
