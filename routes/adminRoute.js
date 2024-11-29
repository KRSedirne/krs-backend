import express from 'express';
import { adminCreateUser } from '../controllers/admin/adminUserController.js';
import { isAuthenticatedUser, isAdmin } from '../middlewares/authMiddleware.js';
import { adminGetAllSuspendeds, adminGetSuspendedDetails, adminCreateSuspended, adminUpdateSuspended, adminDeleteSuspended } from '../controllers/admin/suspendedController.js';

const router = express.Router();

router.route('/user/create').post(isAuthenticatedUser, isAdmin, adminCreateUser);

// Admin suspended routes
router.route("/suspendeds").get(isAuthenticatedUser, isAdmin, adminGetAllSuspendeds);
router.route("/suspended/:id").get(isAuthenticatedUser, isAdmin, adminGetSuspendedDetails);
router.route("/suspended/create").post(isAuthenticatedUser, isAdmin, adminCreateSuspended);
router.route("/suspended/update/:id").get(isAuthenticatedUser, isAdmin, adminUpdateSuspended);
router.route("/suspended/delete/:id").delete(isAuthenticatedUser, isAdmin, adminDeleteSuspended);

export default router; 