import express from 'express';
import { getSeats, getSeatById, createSeat, updateSeat, deleteSeat } from '../controllers/seatController.js';

const router = express.Router();

router.route('/seats').get(getSeats)
router.route('/seat/:id').get(getSeatById)
router.route('/seat/create').post(createSeat)
router.route('/seat/update/:id').put(updateSeat)
router.route('/seat/delete/:id').delete(deleteSeat)

export default router;