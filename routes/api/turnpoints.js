var express = require('express');
var api = express.Router();
var turnpoints = require('../../modules/turnpoints');

api.route('/turnpoints')

    .get(function(req, res) {
        res.json(turnpoints);
    });

module.exports = api;
