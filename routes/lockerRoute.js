import { getAllLockers,getLockerDetails,reserveLocker,lockerReservationTimerExpairedByAuto } from "../controllers/lockerController.js";

import express from "express";

const router=express.Router();

router.route("/lockers").get(getAllLockers);
router.route("/locker/:id").get(getLockerDetails);
//router.route("/locker/create").post(createLocker);
//router.route("/locker/update/:id").put(updateLocker);
//router.route("/locker/delete/:id").delete(deleteLocker);
router.route("/locker/reservation/:id").put(reserveLocker);
//router.route("/locker/reservation/cancel/:id").put(cancelLockerReservation);
router.route("/locker/reservation/autoCancel").put(lockerReservationTimerExpairedByAuto);

export default router;
