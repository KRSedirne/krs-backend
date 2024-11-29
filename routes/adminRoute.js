import express from 'express';
import { adminCreateUser, adminDeleteUser, adminGetAllUsers, adminGetUser, adminUpdateUser } from '../controllers/Admin/adminUserController.js';
import { adminCreateUser } from '../controllers/admin/adminUserController.js';
import { isAuthenticatedUser, isAdmin } from '../middlewares/authMiddleware.js';
import { adminGetAllSuspendeds, adminGetSuspendedDetails, adminCreateSuspended, adminUpdateSuspended, adminDeleteSuspended } from '../controllers/admin/suspendedController.js';

const router = express.Router();

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

export default router; 