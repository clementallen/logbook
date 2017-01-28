const express = require('express');
const Flight = require('../../models/Flight');

const api = express.Router();

api.route('/flights/:id').get((req, res) => {
    Flight.findById(req.params.id).then((flight) => {
        res.json(flight);
    }).catch((error) => {
        res.status(500);
        res.json({
            success: false,
            message: error
        });
    });
});

module.exports = api;
