var express = require('express');
var router = express.Router();
var config = require('../config/config');
var middleware = require('../modules/middleware');

router.get('/', middleware.signedInOnly, (req, res, next) => {
    res.render('upload', {
        title: 'Upload',
        signedIn: req.isAuthenticated(),
        message: req.flash('message')
    });
});

module.exports = router;
