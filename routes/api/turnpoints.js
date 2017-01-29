import { Router } from 'express';
import turnpoints from '../../modules/turnpoints';

const api = Router();

api.route('/turnpoints').get((req, res) => {
    res.json(turnpoints);
});

module.exports = api;
