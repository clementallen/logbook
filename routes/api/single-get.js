var express = require('express');
var api = express.Router();
var mongoose = require('mongoose');
var Flight = require('../../models/Flight');

api.route('/flight/:id')

    .get(function(req, res) {
        Flight.findById(req.params.id, function(err, flight) {
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
    });

module.exports = api;
