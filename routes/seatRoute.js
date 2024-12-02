import express from 'express';
import { getAllSeats, getSeatDetails, createSeat, updateSeat, deleteSeat } from '../controllers/seatController.js';
import { isAuthenticatedUser } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route('/seats').get(isAuthenticatedUser, getAllSeats)
router.route('/seat/:id').get(isAuthenticatedUser, getSeatDetails)
router.route('/seat/create').post(isAuthenticatedUser, createSeat)
router.route('/seat/update/:id').put(isAuthenticatedUser, updateSeat)
router.route('/seat/delete/:id').delete(isAuthenticatedUser, deleteSeat)

export default router;