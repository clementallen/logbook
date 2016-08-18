var express = require('express');
var api = express.Router();
var mongoose = require('mongoose');
var Flight = require('../../models/Flight');

api.route('/flight')

    .post(function(req, res) {
        if(req.body.pilot) {
            var flight = new Flight();

            flight.pilot = req.body.pilot;

            flight.save(function(err, flight) {
                if(err) {
                    res.status(500);
                    res.json({
                        success: false,
                        message: err
                    });

                } else {
                    res.json(flight);
                }
            });

        } else {
            res.status(400);
            res.json({
                success: false,
                message: 'Please submit a flight'
            });
        }
    });

module.exports = api;
