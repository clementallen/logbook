import { Router } from 'express';
import { signedInOnly } from '../modules/middleware';
import flightApiGet from './api/get';
import flightApiPost from './api/post';
import flightApiSingleGet from './api/single-get';
import flightInfoApiPost from './api/flight-info';
import turnpointsApiGet from './api/turnpoints';
import statsApiGet from './api/stats';

const router = Router();

router.get('/flights', flightApiGet);
router.get('/flights/:id', flightApiSingleGet);
router.post('/flight', signedInOnly, flightApiPost);
router.post('/flight-info', signedInOnly, flightInfoApiPost);
router.get('/turnpoints', signedInOnly, turnpointsApiGet);
router.get('/stats/:year?', statsApiGet);

export default router;
