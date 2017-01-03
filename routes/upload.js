const express = require('express');
const middleware = require('../modules/middleware');

const router = express.Router();

router.get('/', middleware.signedInOnly, (req, res, next) => {
    res.render('upload', {
        title: 'Upload',
        signedIn: req.isAuthenticated(),
        message: req.flash('message')
    });
});

module.exports = router;
