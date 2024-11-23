import express from 'express';
import { getAllReservations, getReservationDetails, createReservation, updateReservation, deleteReservation } from '../controllers/reservationController.js';

const router = express.Router();

router.route('/reservations').get(getAllReservations)
router.route('/reservation/:id').get(getReservationDetails)
router.route('/reservation/create').post(createReservation)
router.route('/reservation/update/:id').put(updateReservation)
router.route('/reservation/delete/:id').delete(deleteReservation)

export default router;