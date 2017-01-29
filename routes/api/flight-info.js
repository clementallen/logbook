import { Router } from 'express';
import parseIGC from '../../modules/igcParser';

const router = Router();

router.post('/flight-info', (req, res) => {
    const trace = req.body.trace;
    const flightData = parseIGC(trace);

    res.json(flightData);
});

export default router;
