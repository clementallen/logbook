var express = require('express');
var api = express.Router();
var mongoose = require('mongoose');
var middleware = require('./middleware');

var flightApiGet = require('./flightApi/get');
var flightApiPost = require('./flightApi/post');
var flightApiSingleGet = require('./flightApi/single-get');
var flightApiPut = require('./flightApi/put');
var flightApiDelete = require('./flightApi/delete');

api.get('/flights', flightApiGet);
api.get('/flight/:id', flightApiSingleGet);
api.post('/flight', middleware.signedInOnly, flightApiPost);
api.put('/flight/:id', middleware.signedInOnly, flightApiPut);
api.delete('/flight/:id', middleware.signedInOnly, flightApiDelete);

module.exports = api;
