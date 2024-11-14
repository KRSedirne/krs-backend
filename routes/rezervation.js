import express from 'express';
import { getRezervations, getRezervationById, createRezervation, updateRezervation, deleteRezervation } from '../controllers/rezervationController.js';

const router = express.Router();

router.route('/rezervations').get(getRezervations)
router.route('/rezervation/:id').get(getRezervationById)
router.route('/rezervation/create').post(createRezervation)
router.route('/rezervation/update/:id').put(updateRezervation)
router.route('/rezervation/delete/:id').delete(deleteRezervation)

export default router;