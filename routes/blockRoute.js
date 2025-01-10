import express from 'express';
import { getAllBlocks, getBlockDetails } from '../controllers/blockController.js';
import { isAuthenticatedUser } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Admin Block routes
router.route("/blocks").get(isAuthenticatedUser, getAllBlocks);
router.route("/block/:id").get(isAuthenticatedUser, getBlockDetails);

export default router; 