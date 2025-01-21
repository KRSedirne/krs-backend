import { getAllLockers, getLockerDetails, reserveLocker, getCurrentUserLocker } from "../controllers/lockerController.js";
import { isAuthenticatedUser } from "../middlewares/authMiddleware.js";
import express from "express";

const router = express.Router();

router.route("/lockers").get(isAuthenticatedUser, getAllLockers);
router.route("/locker/:id").get(isAuthenticatedUser, getLockerDetails);
router.route("/locker/reservation/:id").put(isAuthenticatedUser, reserveLocker);
router.route("/locker/reservation/current").put(isAuthenticatedUser, getCurrentUserLocker);

export default router;
