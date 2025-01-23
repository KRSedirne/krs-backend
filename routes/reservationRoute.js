import express from 'express';
import { getAllReservations, getReservationDetails, createReservation, updateReservation, deleteReservation, cancelReservation, getReservationExpireTime, addOutReason, getQRCode, remainReservation, getCurrentUserReservation } from '../controllers/reservationController.js';
import { isAuthenticatedUser } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route('/reservations').get(isAuthenticatedUser, getAllReservations)
router.route('/reservation/qrcode').get(isAuthenticatedUser, getQRCode)
router.route(`/reservation/current`).get(isAuthenticatedUser, getCurrentUserReservation)
router.route('/reservation/:id').get(isAuthenticatedUser, getReservationDetails)
router.route('/reservation/create').post(isAuthenticatedUser, createReservation)
router.route('/reservation/update/:id').put(isAuthenticatedUser, updateReservation)
router.route('/reservation/cancel/:id').delete(isAuthenticatedUser, cancelReservation)
router.route('/reservation/expiretime/:id').get(isAuthenticatedUser, getReservationExpireTime)
router.route('/reservation/outreason/:id').put(isAuthenticatedUser, addOutReason)
router.route('/reservation/remain/:id').put(isAuthenticatedUser, remainReservation)

export default router;