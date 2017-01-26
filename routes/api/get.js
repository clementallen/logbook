const express = require('express');
const Flight = require('../../models/Flight');

const api = express.Router();

api.route('/flights')
    .get((req, res) => {
        Flight.find().sort({ date: 1, takeoffTime: 1 }).exec((err, flights) => {
            if (err) {
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
