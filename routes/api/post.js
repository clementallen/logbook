const express = require('express');
const fs = require('fs');
const formidable = require('formidable');
const path = require('path');
const Flight = require('../../models/Flight');
const config = require('../../config/config');
const s3 = require('s3');

const api = express.Router();

function handleError(err, req, res) {
    res.status(500);
    res.json({
        success: false,
        error: err
    });
}

function saveFlight(req, res, next) {
    const flight = new Flight();
    const flightData = req.customData.formFields;

    flight.pilot = flightData.pilot;
    flight.registration = flightData.registration;
    flight.date = new Date(flightData.date);
    flight.year = new Date(flightData.date).getFullYear();
    flight.distance = flightData.distance;
    flight.task = flightData.task;
    flight.comment = flightData.comment;
    flight.fileName = flightData.fileName;
    flight.takeoffLocation = flightData.takeoffLocation;
    flight.landingLocation = flightData.landingLocation;

    flight.takeoffTime = flightData.takeoffTimestamp;
    flight.landingTime = flightData.landingTimestamp;
    flight.duration = (flightData.landingTimestamp - flightData.takeoffTimestamp) / 1000;

    flight.save((err, dbFlight) => {
        if (err) {
            next(err, req, res);
        } else {
            next(null, req, res);
        }
    });
}

function uploadToS3(req, res, next) {
    const client = s3.createClient({
        s3Options: {
            accessKeyId: config.aws.accessKey,
            secretAccessKey: config.aws.secretKey
        }
    });

    const params = {
        localFile: req.customData.filePath,
        s3Params: {
            Bucket: 'clementallen',
            Key: `logbook/flights/${req.customData.fileName}`
        }
    };

    const uploader = client.uploadFile(params);

    uploader.on('error', (err) => {
        console.error('unable to upload:', err.stack);
        next(err, req, res);
    });

    uploader.on('end', () => {
        fs.unlink(req.customData.filePath);

        next(null, req, res);
    });
}

function saveTraceLocally(req, res, next) {
    const form = new formidable.IncomingForm();
    const fields = {};
    let fileName;
    let filePath;

    form.uploadDir = path.join(__dirname, '../../flights');

    form.on('field', (field, value) => {
        fields[field] = value;
    });

    form.on('file', (field, file) => {
        fileName = file.name;
        filePath = path.join(form.uploadDir, file.name);
        fields.fileName = fileName;
        fs.rename(file.path, filePath);
    });

    form.on('error', (err) => {
        console.log(`An error has occured: \n ${err}`);
        return next(err, req, res);
    });

    form.on('end', () => {
        req.customData = {
            formFields: fields,
            filePath,
            fileName
        };

        next(null, req, res);
    });

    form.parse(req);
}

api.route('/flight')

    .post((req, res) => {
        saveTraceLocally(req, res, (err, req, res) => {
            if (err) return handleError(err, req, res);

            uploadToS3(req, res, (err, req, res) => {
                if (err) return handleError(err, req, res);

                saveFlight(req, res, (err, req, res) => {
                    if (err) return handleError(err, req, res);

                    res.json({
                        success: true
                    });
                });
            });
        });
    });

module.exports = api;
