import { getAllLockers,getLockerDetails,createLocker,updateLocker,deleteLocker,reserveLocker,cancelLockerReservation,lockerReservationTimerExpairedByAuto } from "../controllers/admin/lockerController.js";
import { getAllUsers, getUser, createUser, updateUser, deleteUser } from '../controllers/userController.js';
import express from "express";

const router=express.Router();

router.route("/lockers").get(getAllLockers);
router.route("/locker/:id").get(getLockerDetails);
router.route("/locker/create").post(createLocker);
router.route("/locker/update/:id").put(updateLocker);
router.route("/locker/delete/:id").delete(deleteLocker);
router.route("/locker/reservation/:id").put(reserveLocker);
router.route("/locker/reservation/cancel/:id").put(cancelLockerReservation);
router.route("/locker/reservation/autoCancel").put(lockerReservationTimerExpairedByAuto);




router.route('/users').get(getAllUsers)
router.route('/user/:id').get(getUser)
router.route('/user/create').post(createUser)
router.route('/user/update/:id').put(updateUser)
router.route('/user/delete/:id').delete(deleteUser)


export default router;
