import express from 'express';
import { getAllReservations, getReservationDetails, createReservation, updateReservation, deleteReservation } from '../controllers/reservationController.js';
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route('/reservations').get(authMiddleware, getAllReservations)
router.route('/reservation/:id').get(authMiddleware, getReservationDetails)
router.route('/reservation/create').post(authMiddleware, createReservation)
router.route('/reservation/update/:id').put(authMiddleware, updateReservation)
router.route('/reservation/delete/:id').delete(authMiddleware, deleteReservation)

export default router;