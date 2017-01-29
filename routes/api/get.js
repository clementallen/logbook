import { Router } from 'express';
import Flight from '../../models/Flight';

const api = Router();

api.route('/flights').get((req, res) => {
    Flight.find().sort({ date: 1, takeoffTime: 1 }).exec()
        .then((flights) => {
            res.json(flights);
        })
        .catch((error) => {
            res.status(500);
            res.json({
                success: false,
                message: error
            });
        });
});

module.exports = api;
