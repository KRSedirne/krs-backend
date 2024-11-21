import { getAllLockers,getLockerDetails,createLocker,updateLocker,deleteLocker,reserveLocker,cancelLockerReservation } from "../controllers/lockerController.js";
import express from "express";

const router=express.Router();

router.route("/lockers").get(getAllLockers);
router.route("/locker/:id").get(getLockerDetails);
router.route("/locker/create").post(createLocker);
router.route("/locker/update/:id").put(updateLocker);
router.route("/locker/delete/:id").delete(deleteLocker);
router.route("/locker/reservation/:id").put(reserveLocker);
router.route("/locker/reservation/cancellation/:id").put(cancelLockerReservation);

export default router;
