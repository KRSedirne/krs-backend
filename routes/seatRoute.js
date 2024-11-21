import express from 'express';
import { getAllSeats, getSeatDetails, createSeat, updateSeat, deleteSeat } from '../controllers/seatController.js';

const router = express.Router();

router.route('/seats').get(getAllSeats)
router.route('/seat/:id').get(getSeatDetails)
router.route('/seat/create').post(createSeat)
router.route('/seat/update/:id').put(updateSeat)
router.route('/seat/delete/:id').delete(deleteSeat)

export default router;