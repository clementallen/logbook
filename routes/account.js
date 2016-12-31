var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('../models/User');
var middleware = require('../modules/middleware');
var accountDelete = require('./account/delete');

router.get('/delete', middleware.signedInOnly, accountDelete);
router.post('/delete', middleware.signedInOnly, accountDelete);

router.get('/', middleware.signedInOnly, (req, res) => {
    res.render('account', {
        title: 'Logbook | Account',
        user: req.user,
        signedIn: req.isAuthenticated()
    });
});

module.exports = router;
