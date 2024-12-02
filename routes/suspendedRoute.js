import express from 'express';
import { getAllSuspendeds, getSuspendedDetails, createSuspended, updateSuspended, deleteSuspended } from '../controllers/suspendedController.js';
import { isAuthenticatedUser } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route('/suspendeds').get(isAuthenticatedUser, getAllSuspendeds)
router.route('/suspended/:id').get(isAuthenticatedUser, getSuspendedDetails)
router.route('/suspended/create').post(isAuthenticatedUser, createSuspended)
router.route('/suspended/update/:id').put(isAuthenticatedUser, updateSuspended)
router.route('/suspended/delete/:id').delete(isAuthenticatedUser, deleteSuspended)

export default router;