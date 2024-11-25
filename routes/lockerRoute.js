import { getAllLockers,getLockerDetails,reserveLocker,lockerReservationTimerExpairedByAuto } from "../controllers/lockerController.js";
//needs to change
import authMiddleware from "../middlewares/authMiddlewares.js";
import express from "express";
const router=express.Router();

router.route("/lockers").get(authMiddleware,getAllLockers);
router.route("/locker/:id").get(authMiddleware,getLockerDetails);
router.route("/locker/reservation/:id").put(authMiddleware,reserveLocker);
router.route("/locker/reservation/autoCancel").put(authMiddleware,lockerReservationTimerExpairedByAuto);

export default router;
