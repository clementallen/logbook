import { Router } from 'express';
import middleware from '../modules/middleware';
import flightApiGet from './api/get';
import flightApiPost from './api/post';
import flightApiSingleGet from './api/single-get';
import flightInfoApiPost from './api/flight-info';
import turnpointsApiGet from './api/turnpoints';
import statsApiGet from './api/stats';

const api = Router();

api.get('/flights', flightApiGet);
api.get('/flights/:id', flightApiSingleGet);
api.post('/flight', middleware.signedInOnly, flightApiPost);
api.post('/flight-info', middleware.signedInOnly, flightInfoApiPost);
api.get('/turnpoints', middleware.signedInOnly, turnpointsApiGet);
api.get('/stats/:year?', statsApiGet);

module.exports = api;
