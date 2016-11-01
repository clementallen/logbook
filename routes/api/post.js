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

function handleError(err, req, res) {
    res.status(500);
    res.json({
        success: false,
        error: err
    });
}

function saveFlight(req, res, next) {
    var flight = new Flight();
    var flightData = req.customData.formFields;

    flight.pilot = flightData.pilot;
    flight.registration = flightData.registration;
    flight.date = new Date(flightData.date);
    flight.distance = flightData.distance;
    flight.task = flightData.task;
    flight.comment = flightData.comment;
    flight.fileName = flightData.fileName;
    flight.takeoffLocation = flightData.takeoffLocation;
    flight.landingLocation = flightData.landingLocation;

    flight.takeoffTime = flightData.takeoffTimestamp;
    flight.landingTime = flightData.landingTimestamp;
    flight.duration = (flightData.landingTimestamp - flightData.takeoffTimestamp) / 1000;

    flight.save(function(err, flight) {
        if(err) {
            next(err, req, res);
        } else {
            next(null, req, res);
        }
    });
}

function uploadToS3(req, res, next) {
    var client = s3.createClient({
        s3Options: {
            accessKeyId: config.aws.accessKey,
            secretAccessKey: config.aws.secretKey,
        },
    });

    var params = {
        localFile: req.customData.filePath,

        s3Params: {
            Bucket: 'clementallen',
            Key: 'logbook/flights/' + req.customData.fileName,
        },
    };

    var uploader = client.uploadFile(params);

    uploader.on('error', function(err) {
        console.error('unable to upload:', err.stack);
        next(err, req, res);
    });

    uploader.on('end', function() {
        fs.unlink(req.customData.filePath);

        next(null, req, res);
    });
}

function saveTraceLocally(req, res, next) {
    var fields = {};
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
        fields.fileName = fileName;
        fs.rename(file.path, filePath);
    });

    form.on('error', function(err) {
        console.log('An error has occured: \n' + err);
        return next(err, req, res);
    });

    form.on('end', function() {
        req.customData = {
            formFields: fields,
            filePath: filePath,
            fileName: fileName
        };

        next(null, req, res);
    });

    form.parse(req);
}

api.route('/flight')

    .post(function(req, res) {
        saveTraceLocally(req, res, function(err, req, res) {
            if(err) return handleError(err, req, res);

            uploadToS3(req, res, function(err, req, res) {
                if(err) return handleError(err, req, res);

                saveFlight(req, res, function(err, req, res) {
                    if(err) return handleError(err, req, res);

                    res.json({
                        success: true
                    });
                });
            });
        });
    });

module.exports = api;
