var express = require('express');
var api = express.Router();
var mongoose = require('mongoose');
var Flight = require('../../models/Flight');

api.route('/stats/:year?')

    .get(function(req, res) {
        var years = [2014, 2015, 2016];
        if(req.params.year) {
            var year = parseInt(req.params.year, 10);
            years = [year];
        }

        Flight.aggregate([
            {
                $match: { year: { $in: years } }
            },
            {
                $group: {
                    _id: '$pilot',
                    totalDistance: { $sum: '$distance' },
                    totalDuration: { $sum: '$duration' },
                    totalFlights: { $sum: 1 },
                    averageDistance: { $avg: '$distance' },
                    averageDuration: { $avg: '$duration' }
                }
            },
            {
                $project: {
                    tmp: {
                        pilot: '$_id',
                        totalDistance: '$totalDistance',
                        totalDuration: '$totalDuration',
                        totalFlights: '$totalFlights',
                        averageDistance: '$averageDistance',
                        averageDuration: '$averageDuration',
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalDistance: { $sum: '$tmp.totalDistance' },
                    totalDuration: { $sum: '$tmp.totalDuration' },
                    totalFlights: { $sum: '$tmp.totalFlights' },
                    averageDistance: { $sum: '$tmp.averageDistance' },
                    averageDuration: { $sum: '$tmp.averageDuration' },
                    pilots: {
                        $addToSet: '$tmp'
                    }
                }
            }
        ]).exec(function(error, result) {
            if(error) {
                res.status(500);
                res.json({
                    success: false,
                    message: error
                });

            } else {
                res.json(result);
            }
        });
    });

module.exports = api;
