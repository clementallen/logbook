var express = require('express');
var api = express.Router();
var mongoose = require('mongoose');
var Flight = require('../../models/Flight');

api.route('/flights')

    .get(function(req, res) {
        Flight.find({}, function(err, flights) {
            if(err) {
                res.status(500);
                res.json({
                    success: false,
                    message: err
                });

            } else {
                res.json(flights);
            }
        });
    });

module.exports = api;
