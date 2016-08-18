var express = require('express');
var router = express.Router();
var config = require('../config/config');

router.get('/', (req, res, next) => {
    res.render('index', {
        title: 'Logbook',
        signedIn: req.isAuthenticated(),
        message: req.flash('message'),
        tempMessage: config.tempMessage
    });
});

module.exports = router;
