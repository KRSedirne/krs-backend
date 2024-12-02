import express from 'express';
import { getAllReservations, getReservationDetails, createReservation, updateReservation, deleteReservation } from '../controllers/reservationController.js';
import { isAuthenticatedUser } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route('/reservations').get(isAuthenticatedUser, getAllReservations)
router.route('/reservation/:id').get(isAuthenticatedUser, getReservationDetails)
router.route('/reservation/create').post(isAuthenticatedUser, createReservation)
router.route('/reservation/update/:id').put(isAuthenticatedUser, updateReservation)
router.route('/reservation/delete/:id').delete(isAuthenticatedUser, deleteReservation)

export default router;