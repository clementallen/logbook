var express = require('express');
var api = express.Router();
var parseIGC = require('../../modules/igcParser.js');

api.route('/flight-info')

    .post(function(req, res) {

        var trace = req.body.trace;

        var flightData = parseIGC(trace);

        return res.json(flightData);
    });

module.exports = api;
