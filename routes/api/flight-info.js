import { Router } from 'express';
import parseIGC from '../../modules/igcParser';

const api = Router();

api.route('/flight-info').post((req, res) => {
    const trace = req.body.trace;
    const flightData = parseIGC(trace);

    res.json(flightData);
});

module.exports = api;
