var express = require('express');
var api = express.Router();
var mongoose = require('mongoose');
var Flight = require('../../models/Flight');

api.route('/flight/:id')

    .put(function(req, res) {
        Flight.findById(req.params.id, function(err, flight) {
            if(err) {
                res.status(500);
                res.json({
                    success: false,
                    message: err
                });

            } else {
                if(req.body.content) {
                    flight.content = req.body.content;
                    flight.user = req.user.username;

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
                        message: 'Please enter a flight'
                    });
                }

            }

        });
    });

module.exports = api;
