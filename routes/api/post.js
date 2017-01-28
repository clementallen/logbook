const fs = require('fs');
const s3 = require('s3');
const path = require('path');
const express = require('express');
const Promise = require('bluebird');
const formidable = require('formidable');
const Flight = require('../../models/Flight');
const config = require('../../config/config');

const api = express.Router();

function saveFlight(traceData) {
    return new Promise((resolve, reject) => {
        const flight = new Flight();
        const flightData = traceData.formFields;

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

        flight.save().then(() => {
            resolve();
        })
        .catch((error) => {
            reject(error);
        });
    });
}

function uploadToS3(traceData) {
    return new Promise((resolve, reject) => {
        const client = s3.createClient({
            s3Options: {
                accessKeyId: config.aws.accessKey,
                secretAccessKey: config.aws.secretKey
            }
        });

        const uploadParams = {
            localFile: traceData.filePath,
            s3Params: {
                Bucket: config.aws.bucket,
                Key: `${config.aws.path}${traceData.fileName}`
            }
        };

        const uploader = client.uploadFile(uploadParams);

        uploader.on('error', (error) => {
            console.error('Unable to upload:', error.stack);
            fs.unlink(traceData.filePath);
            reject(error);
        });

        uploader.on('end', () => {
            fs.unlink(traceData.filePath);
            resolve(traceData);
        });
    });
}

function saveTraceLocally(req, res) {
    return new Promise((resolve, reject) => {
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

        form.on('error', (error) => {
            console.log(`An error has occured: \n ${error}`);
            reject(error);
        });

        form.on('end', () => {
            const traceData = {
                formFields: fields,
                filePath,
                fileName
            };
            resolve(traceData);
        });

        form.parse(req);
    });
}

api.route('/flight').post((req, res) => {
    saveTraceLocally(req, res)
        .then((traceData) => {
            return uploadToS3(traceData);
        })
        .then((traceData) => {
            return saveFlight(traceData);
        })
        .then(() => {
            res.json({
                success: true
            });
        })
        .catch((error) => {
            res.status(500);
            res.json({
                success: false,
                error
            });
        });
});

module.exports = api;
