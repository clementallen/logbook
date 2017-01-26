const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
    res.render('logbook', {
        title: 'HCV Logbook',
        signedIn: req.isAuthenticated(),
        message: req.flash('message'),
        years: [2014, 2015, 2016, 2017]
    });
});

module.exports = router;
