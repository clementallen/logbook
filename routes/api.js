const express = require('express');
const middleware = require('../modules/middleware');
const flightApiGet = require('./api/get');
const flightApiPost = require('./api/post');
const flightApiSingleGet = require('./api/single-get');
const flightInfoApiPost = require('./api/flight-info');
const turnpointsApiGet = require('./api/turnpoints');
const statsApiGet = require('./api/stats');

const api = express.Router();

api.get('/flights', flightApiGet);
api.get('/flights/:id', flightApiSingleGet);
api.post('/flight', middleware.signedInOnly, flightApiPost);
api.post('/flight-info', middleware.signedInOnly, flightInfoApiPost);
api.get('/turnpoints', turnpointsApiGet);
api.get('/stats/:year?', statsApiGet);

module.exports = api;
