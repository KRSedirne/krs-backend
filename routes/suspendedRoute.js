import express from 'express';
import { getAllSuspendeds, getSuspendedDetails, createSuspended, updateSuspended, deleteSuspended } from '../controllers/suspendedController.js';
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route('/suspendeds').get(authMiddleware, getAllSuspendeds)
router.route('/suspended/:id').get(authMiddleware, getSuspendedDetails)
router.route('/suspended/create').post(authMiddleware, createSuspended)
router.route('/suspended/update/:id').put(authMiddleware, updateSuspended)
router.route('/suspended/delete/:id').delete(authMiddleware, deleteSuspended)

export default router;