const express = require('express');
const middleware = require('../modules/middleware');
const accountDelete = require('./account/delete');

const router = express.Router();

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
