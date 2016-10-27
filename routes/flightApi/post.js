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
}

api.route('/flight')

    .post(function(req, res) {

        var form = new formidable.IncomingForm();

        form.uploadDir = path.join(__dirname, '../../flights');

        form.on('file', function(field, file) {
            this.fileName = file.name;
            fs.rename(file.path, path.join(form.uploadDir, file.name));

            fs.readFile(form.uploadDir + '/' + file.name, 'utf8', function(err, data) {
                if(err) {
                    return console.log(err);
                }
                var igcData = parseIGC(data);
                
                saveFlight(igcData);
            });
        });

        form.on('error', function(err) {
            console.log('An error has occured: \n' + err);
        });

        form.on('end', function() {
            res.end('success');
        });

        form.parse(req);
    });

module.exports = api;
