import express from 'express';
import { getAllPunishments, getPunishmentDetails, createPunishment, updatePunishment, deletePunishment } from '../controllers/punishmentController.js';
import {isAuthenticatedUser} from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/punishments').get(isAuthenticatedUser,getAllPunishments)
router.route('/punishment/:id').get(isAuthenticatedUser,getPunishmentDetails)
router.route('/punishment/create').post(isAuthenticatedUser,createPunishment)
router.route('/punishment/update/:id').put(isAuthenticatedUser,updatePunishment)
router.route('/punishment/delete/:id').delete(isAuthenticatedUser,deletePunishment)

export default router;