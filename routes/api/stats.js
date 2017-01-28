const express = require('express');
const Flight = require('../../models/Flight');

const api = express.Router();

api.route('/stats/:year?').get((req, res) => {
    let years = [2014, 2015, 2016, 2017];
    if (req.params.year) {
        const year = parseInt(req.params.year, 10);
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
                    averageDuration: '$averageDuration'
                }
            }
        },
        {
            $group: {
                _id: null,
                totalDistance: { $sum: '$tmp.totalDistance' },
                totalDuration: { $sum: '$tmp.totalDuration' },
                totalFlights: { $sum: '$tmp.totalFlights' },
                averageDistance: { $avg: '$tmp.averageDistance' },
                averageDuration: { $avg: '$tmp.averageDuration' },
                pilots: {
                    $addToSet: '$tmp'
                }
            }
        }
    ]).then((result) => {
        res.json(result);
    }).catch((error) => {
        res.status(500);
        res.json({
            success: false,
            message: error
        });
    });
});

module.exports = api;
