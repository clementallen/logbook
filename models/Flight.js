var mongoose = require('mongoose');

var flightSchema = new mongoose.Schema({
    pilot: String,
    registration: String
});

module.exports = mongoose.model('flight', flightSchema);
