import { Router } from 'express';
import turnpoints from '../../modules/turnpoints';

const router = Router();

router.get('/turnpoints', (req, res) => {
    res.json(turnpoints);
});

export default router;
