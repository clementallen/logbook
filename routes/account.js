import { Router } from 'express';
import accountDelete from './account/delete';

const router = Router();

router.get('/delete', accountDelete);
router.post('/delete', accountDelete);

router.get('/', (req, res) => {
    res.render('account', {
        title: 'Logbook | Account',
        signedIn: req.isAuthenticated(),
        user: req.user
    });
});

export default router;
