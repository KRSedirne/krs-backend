import { adminGetAllLockers,adminGetLockerDetails,adminCreateLocker,adminUpdateLocker,adminDeleteLocker,adminReserveLocker,adminCancelLockerReservation} from "../controllers/admin/adminLockerController.js";
import { adminGetAllUsers, adminGetUser, adminCreateUser, adminUpdateUser, adminDeleteUser } from '../controllers/admin/adminUserController.js';
import { isAuthenticatedUser, isAdmin } from '../middlewares/authMiddleware.js';

import express from "express";

const router=express.Router();

router.route("/lockers").get(isAuthenticatedUser,isAdmin,adminGetAllLockers);
router.route("/locker/:id").get(isAuthenticatedUser,isAdmin,adminGetLockerDetails);
router.route("/locker/create").post(isAuthenticatedUser,isAdmin,adminCreateLocker);
router.route("/locker/update/:id").put(isAuthenticatedUser,isAdmin,adminUpdateLocker);
router.route("/locker/delete/:id").delete(isAuthenticatedUser,isAdmin,adminDeleteLocker);
router.route("/locker/reservation/:id").put(isAuthenticatedUser,isAdmin,adminReserveLocker);
router.route("/locker/reservation/cancel/:id").put(isAuthenticatedUser,isAdmin,adminCancelLockerReservation);




router.route('/users').get(adminGetAllUsers)
router.route('/user/:id').get(adminGetUser)
router.route('/user/create').post(isAuthenticatedUser,isAdmin,adminCreateUser)
router.route('/user/update/:id').put(isAuthenticatedUser,isAdmin,adminUpdateUser)
router.route('/user/delete/:id').delete(isAuthenticatedUser,isAdmin,adminDeleteUser)




export default router; 