var express = require('express');
var api = express.Router();
var mongoose = require('mongoose');
var fs = require('fs');
var formidable = require('formidable');
var path = require('path');
var parseIGC = require('../../modules/igcParser.js');
var Flight = require('../../models/Flight');
var config = require('../../config/config');
var s3 = require('s3');

var client = s3.createClient({
    s3Options: {
        accessKeyId: config.aws.accessKey,
        secretAccessKey: config.aws.secretKey,
    },
});

function saveFlight(flightData) {

    var flight = new Flight();

    flight.pilot = flightData.pilot;
    flight.registration = flightData.registration;

    flight.save(function(err, flight) {
        return flight;
    });
}

api.route('/flight')

    .post(function(req, res) {
        var fields = [];
        var fileName;
        var filePath;
        var form = new formidable.IncomingForm();

        form.uploadDir = path.join(__dirname, '../../flights');

        form.on('field', function(field, value) {
            fields[field] = value;
        });

        form.on('file', function(field, file) {
            fileName = file.name;
            filePath = path.join(form.uploadDir, file.name);
            fs.rename(file.path, filePath);
        });

        form.on('error', function(err) {
            console.log('An error has occured: \n' + err);
        });

        form.on('end', function() {
            var params = {
                localFile: filePath,

                s3Params: {
                    Bucket: 'clementallen',
                    Key: 'logbook/flights/' + fileName,
                },
            };

            var uploader = client.uploadFile(params);

            uploader.on('error', function(err) {
                console.error('unable to upload:', err.stack);
            });

            uploader.on('end', function() {

                fs.unlink(filePath, function() {
                    res.json({
                        success: true
                    });
                });

            });
        });

        form.parse(req);
    });

module.exports = api;
