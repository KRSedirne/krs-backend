import express from 'express';
import { getPunishments, getPunishmentById, createPunishment, updatePunishment, deletePunishment } from '../controllers/punishmentController.js';

const router = express.Router();

router.route('/punishments').get(getPunishments)
router.route('/punishment/:id').get(getPunishmentById)
router.route('/punishment/create').post(createPunishment)
router.route('/punishment/update/:id').put(updatePunishment)
router.route('/punishment/delete/:id').delete(deletePunishment)

export default router;