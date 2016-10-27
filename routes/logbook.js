var express = require('express');
var router = express.Router();
var config = require('../config/config');

router.get('/', (req, res, next) => {
    res.render('logbook', {
        title: 'Logbook',
        signedIn: req.isAuthenticated(),
        message: req.flash('message')
    });
});

module.exports = router;
