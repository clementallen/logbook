const express = require('express');
const Flight = require('../../models/Flight');

const api = express.Router();

api.route('/flight/:id')
    .get((req, res) => {
        Flight.findById(req.params.id, (err, flight) => {
            if (err) {
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
