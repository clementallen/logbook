var mongoose = require('mongoose');

var flightSchema = new mongoose.Schema({
    pilot: {
        type: String,
        required: true
    },
    registration: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    distance: {
        type: Number,
        required: true
    },
    task: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    fileName: {
        type: String,
        required: true,
        unique: true
    },
    takeoffLocation: {
        type: String,
        required: true
    },
    landingLocation: {
        type: String,
        required: true
    },
    takeoffTime: {
        type: Number,
        required: true
    },
    landingTime: {
        type: Number,
        required: true
    },
    duration: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('flight', flightSchema);
