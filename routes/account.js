import { Router } from 'express';
import { signedInOnly } from '../modules/middleware';
import accountDelete from './account/delete';

const router = Router();

router.get('/delete', signedInOnly, accountDelete);
router.post('/delete', signedInOnly, accountDelete);

router.get('/', signedInOnly, (req, res) => {
    res.render('account', {
        title: 'Logbook | Account',
        user: req.user
    });
});

module.exports = router;
