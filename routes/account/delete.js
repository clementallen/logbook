const express = require('express');
const User = require('../../models/User');

const router = express.Router();

router.route('/delete')
    .get((req, res) => {
        res.render('delete-account', {
            title: 'Logbook | Delete account',
            message: req.flash('message')
        });
    })
    .post((req, res) => {
        User.remove({ username: req.user.username }).then(() => {
            req.logout();
            req.flash('message', 'Your account has been deleted, we\'re sorry to see you go :(');
            res.redirect('/');
        }).catch((error) => {
            req.flash('message', 'We were unable to remove your account.  Please try again');
        });
    });


module.exports = router;
