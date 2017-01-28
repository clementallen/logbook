const express = require('express');
const turnpoints = require('../../modules/turnpoints');

const api = express.Router();

api.route('/turnpoints')
    .get((req, res) => {
        res.json(turnpoints);
    });

module.exports = api;
