var express = require('express');
var router = express.Router();
var config = require('../config/config');

router.get('/', (req, res, next) => {
    res.render('logbook', {
        title: 'HCV Logbook',
        signedIn: req.isAuthenticated(),
        message: req.flash('message'),
        tempMessage: config.tempMessage,
        years: [2014, 2015, 2016]
    });
});

module.exports = router;
