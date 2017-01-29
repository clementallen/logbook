import { Router } from 'express';
import Flight from '../../models/Flight';

const api = Router();

api.route('/flights/:id').get((req, res) => {
    Flight.findById(req.params.id).then((flight) => {
        let response;
        if (flight !== null) {
            response = flight;
        } else {
            response = {
                success: false,
                message: 'Flight not found'
            };
        }
        res.json(response);
    }).catch((error) => {
        res.status(500);
        res.json({
            success: false,
            message: error
        });
    });
});

module.exports = api;
