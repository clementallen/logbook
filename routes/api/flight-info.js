const express = require('express');
const parseIGC = require('../../modules/igcParser.js');

const api = express.Router();

api.route('/flight-info')
    .post((req, res) => {
        const trace = req.body.trace;
        const flightData = parseIGC(trace);

        res.json(flightData);
    });

module.exports = api;
