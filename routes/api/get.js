const express = require('express');
const Flight = require('../../models/Flight');

const api = express.Router();

api.route('/flights').get((req, res) => {
    Flight.find().sort({ date: 1, takeoffTime: 1 }).exec()
        .then((flights) => {
            res.json(flights);
        })
        .catch((error) => {
            res.status(500);
            res.json({
                success: false,
                message: error
            });
        });
});

module.exports = api;
