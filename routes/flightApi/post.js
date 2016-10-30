var express = require('express');
var api = express.Router();
var mongoose = require('mongoose');
var fs = require('fs');
var formidable = require('formidable');
var path = require('path');
var parseIGC = require('../../modules/igcParser.js');
var Flight = require('../../models/Flight');

function saveFlight(flightData) {
    console.log(flightData);

    var flight = new Flight();

    flight.pilot = flightData.headers[2].value;
    flight.registration = flightData.headers[4].value;

    console.log(flight);

    flight.save(function(err, flight) {
        return flight;
    });
}

api.route('/flight')

    .post(function(req, res) {
        var fields = [];
        var form = new formidable.IncomingForm();

        form.uploadDir = path.join(__dirname, '../../flights');

        form.on('field', function (field, value) {
            console.log(field);
            console.log(value);
            fields[field] = value;
        });

        form.on('file', function(field, file) {
            fs.rename(file.path, path.join(form.uploadDir, file.name));
        });

        form.on('error', function(err) {
            console.log('An error has occured: \n' + err);
        });

        form.on('end', function() {
            console.log(fields);
            res.end('success');
        });

        form.parse(req);
    });

module.exports = api;
