import express from 'express';
import { getAllPunishments, getPunishmentDetails, createPunishment, updatePunishment, deletePunishment } from '../controllers/punishmentController.js';

const router = express.Router();

router.route('/punishments').get(getAllPunishments)
router.route('/punishment/:id').get(getPunishmentDetails)
router.route('/punishment/create').post(createPunishment)
router.route('/punishment/update/:id').put(updatePunishment)
router.route('/punishment/delete/:id').delete(deletePunishment)

export default router;