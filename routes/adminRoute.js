import express from 'express';
import { adminCreateUser, adminDeleteUser, adminGetAllUsers, adminGetUserDetails, adminUpdateUser } from '../controllers/admin/adminUserController.js';
import { isAuthenticatedUser, isAdmin } from '../middlewares/authMiddleware.js';
import { adminGetAllSuspendeds, adminGetSuspendedDetails, adminCreateSuspended, adminUpdateSuspended, adminDeleteSuspended, adminManuallyCheckSuspended } from '../controllers/admin/adminSuspendedController.js';
import { adminGetAllLockers, adminGetLockerDetails, adminCreateLocker, adminUpdateLocker, adminDeleteLocker, adminReserveLocker, adminCancelLockerReservation } from '../controllers/admin/adminLockerController.js';
import { adminGetAllReservations, adminGetReservationDetails, adminCreateReservation, adminUpdateReservation, adminDeleteReservation, adminCancelReservation, adminGetReservationExpireTime, adminAddOutReason, adminGetQRCode, adminRemainReservation } from '../controllers/admin/adminReservationController.js';
import { adminGetAllSeats, adminGetSeatDetails, adminCreateSeat, adminUpdateSeat, adminDeleteSeat } from '../controllers/admin/adminSeatController.js';
import { adminGetAllBlocks, adminGetBlockDetails, adminCreateBlock, adminUpdateBlock, adminDeleteBlock, adminAddSaloon } from '../controllers/admin/adminBlockController.js';
import { isCheckingQr } from '../controllers/Admin/adminController.js';

const router = express.Router();

// Admin User routes
router.route('/users').get(isAuthenticatedUser, isAdmin, adminGetAllUsers)
router.route('/user/:id').get(isAuthenticatedUser, isAdmin, adminGetUserDetails)
router.route('/user/create').post(isAuthenticatedUser, isAdmin, adminCreateUser);
router.route('/user/update/:id').put(isAuthenticatedUser, isAdmin, adminUpdateUser)
router.route('/user/delete/:id').delete(isAuthenticatedUser, isAdmin, adminDeleteUser)

// Admin suspended routes
router.route("/suspendeds").get(isAuthenticatedUser, isAdmin, adminGetAllSuspendeds);
router.route("/suspended/:id").get(isAuthenticatedUser, isAdmin, adminGetSuspendedDetails);
router.route("/suspended/create").post(isAuthenticatedUser, isAdmin, adminCreateSuspended);
router.route("/suspended/update/:id").put(isAuthenticatedUser, isAdmin, adminUpdateSuspended);
router.route("/suspended/delete/:id").delete(isAuthenticatedUser, isAdmin, adminDeleteSuspended);
router.route("/suspended/checkmanually/:id").get(isAuthenticatedUser, isAdmin, adminManuallyCheckSuspended);

// Admin Locker routes
router.route("/lockers").get(isAuthenticatedUser, isAdmin, adminGetAllLockers);
router.route("/locker/:id").get(isAuthenticatedUser, isAdmin, adminGetLockerDetails);
router.route("/locker/create").post(isAuthenticatedUser, isAdmin, adminCreateLocker);
router.route("/locker/update/:id").put(isAuthenticatedUser, isAdmin, adminUpdateLocker);
router.route("/locker/delete/:id").delete(isAuthenticatedUser, isAdmin, adminDeleteLocker);
router.route("/locker/reservation/:id").put(isAuthenticatedUser, isAdmin, adminReserveLocker);
router.route("/locker/reservation/cancel/:id").put(isAuthenticatedUser, isAdmin, adminCancelLockerReservation);

// Admin Reservation routes
router.route("/reservations").get(isAuthenticatedUser, isAdmin, adminGetAllReservations);
router.route("/reservation/:id").get(isAuthenticatedUser, isAdmin, adminGetReservationDetails);
router.route("/reservation/create").post(isAuthenticatedUser, isAdmin, adminCreateReservation);
router.route("/reservation/update/:id").put(isAuthenticatedUser, isAdmin, adminUpdateReservation);
router.route("/reservation/delete/:id").delete(isAuthenticatedUser, isAdmin, adminDeleteReservation);
router.route("/reservation/cancel/:id").delete(isAuthenticatedUser, isAdmin, adminCancelReservation);
router.route("/reservation/expiretime/:id").get(isAuthenticatedUser, isAdmin, adminGetReservationExpireTime);
router.route("/reservation/outreason/:id").put(isAuthenticatedUser, isAdmin, adminAddOutReason);
router.route("/reservation/qrcode/:id").get(isAuthenticatedUser, isAdmin, adminGetQRCode);
router.route("/reservation/remain/:id").put(isAuthenticatedUser, isAdmin, adminRemainReservation);

// Admin Seat routes
router.route("/seats").get(isAuthenticatedUser, isAdmin, adminGetAllSeats);
router.route("/seat/:id").get(isAuthenticatedUser, isAdmin, adminGetSeatDetails);
router.route("/seat/create").post(isAuthenticatedUser, isAdmin, adminCreateSeat);
router.route("/seat/update/:id").put(isAuthenticatedUser, isAdmin, adminUpdateSeat);
router.route("/seat/delete/:id").delete(isAuthenticatedUser, isAdmin, adminDeleteSeat);

// Admin Block routes
router.route("/blocks").get(isAuthenticatedUser, isAdmin, adminGetAllBlocks);
router.route("/block/:id").get(isAuthenticatedUser, isAdmin, adminGetBlockDetails);
router.route("/block/create").post(isAuthenticatedUser, isAdmin, adminCreateBlock);
router.route("/block/update/:id").put(isAuthenticatedUser, isAdmin, adminUpdateBlock);
router.route("/block/delete/:id").delete(isAuthenticatedUser, isAdmin, adminDeleteBlock);
router.route("/block/saloon/create/:id").post(isAuthenticatedUser, isAdmin,adminAddSaloon);

//admin QR code routes
router.route("/checkqr").post(isAuthenticatedUser, isAdmin,isCheckingQr);

export default router; 