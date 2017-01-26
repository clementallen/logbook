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
        User.remove({ username: req.user.username }, (err, mongoResult) => {
            if (err) {
                console.log(err);
            } else {
                req.logout();
            }
        });
        req.flash('message', 'Your account has been deleted, we\'re sorry to see you go :(');
        res.redirect('/');
    });


module.exports = router;
