import express from 'express';
import { adminCreateUser, adminDeleteUser, adminGetAllUsers, adminGetUser, adminUpdateUser } from '../controllers/admin/adminUserController.js';
import { isAuthenticatedUser, isAdmin } from '../middlewares/authMiddleware.js';
import { adminGetAllSuspendeds, adminGetSuspendedDetails, adminCreateSuspended, adminUpdateSuspended, adminDeleteSuspended } from '../controllers/admin/adminSuspendedController.js';
import { adminGetAllLockers, adminGetLockerDetails, adminCreateLocker, adminUpdateLocker, adminDeleteLocker, adminReserveLocker, adminCancelLockerReservation } from '../controllers/admin/adminLockerController.js';

const router = express.Router();

// Admin User routes
router.route('/user/create').post(isAuthenticatedUser, isAdmin, adminCreateUser);
router.route('/user/delete/:id').delete(isAuthenticatedUser, isAdmin, adminDeleteUser)
router.route('/user/update/:id').put(isAuthenticatedUser, isAdmin, adminUpdateUser)
router.route('/users').get(isAuthenticatedUser, isAdmin, adminGetAllUsers)
router.route('/user/:id').get(isAuthenticatedUser, isAdmin, adminGetUser)
router.route('/user/create').post(isAuthenticatedUser, isAdmin, adminCreateUser);

// Admin suspended routes
router.route("/suspendeds").get(isAuthenticatedUser, isAdmin, adminGetAllSuspendeds);
router.route("/suspended/:id").get(isAuthenticatedUser, isAdmin, adminGetSuspendedDetails);
router.route("/suspended/create").post(isAuthenticatedUser, isAdmin, adminCreateSuspended);
router.route("/suspended/update/:id").get(isAuthenticatedUser, isAdmin, adminUpdateSuspended);
router.route("/suspended/delete/:id").delete(isAuthenticatedUser, isAdmin, adminDeleteSuspended);

// Admin Locker routes
router.route("/lockers").get(isAuthenticatedUser, isAdmin, adminGetAllLockers);
router.route("/locker/:id").get(isAuthenticatedUser, isAdmin, adminGetLockerDetails);
router.route("/locker/create").post(isAuthenticatedUser, isAdmin, adminCreateLocker);
router.route("/locker/update/:id").put(isAuthenticatedUser, isAdmin, adminUpdateLocker);
router.route("/locker/delete/:id").delete(isAuthenticatedUser, isAdmin, adminDeleteLocker);
router.route("/locker/reservation/:id").put(isAuthenticatedUser, isAdmin, adminReserveLocker);
router.route("/locker/reservation/cancel/:id").put(isAuthenticatedUser, isAdmin, adminCancelLockerReservation);


export default router; 