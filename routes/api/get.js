var express = require('express');
var api = express.Router();
var mongoose = require('mongoose');
var Flight = require('../../models/Flight');

api.route('/flights')

    .get(function(req, res) {
        Flight.find().sort({ date: 1, takeoffTime: 1}).exec(function(err, flights) {
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
