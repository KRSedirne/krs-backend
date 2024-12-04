import express from 'express';
import { getAllSuspendeds, getSuspendedDetails, updateSuspended, deleteSuspended, manuallyCheckSuspended } from '../controllers/suspendedController.js';
import { isAuthenticatedUser } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route('/suspendeds').get(isAuthenticatedUser, getAllSuspendeds)
router.route('/suspended/:id').get(isAuthenticatedUser, getSuspendedDetails)
router.route('/suspended/update/:id').put(isAuthenticatedUser, updateSuspended)
router.route('/suspended/delete/:id').delete(isAuthenticatedUser, deleteSuspended)
router.route('/suspended/checkmanually/:id').get(isAuthenticatedUser, manuallyCheckSuspended)

export default router;