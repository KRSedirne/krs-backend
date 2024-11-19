import express from 'express';
import { getAllRezervations, getRezervation, createRezervation, updateRezervation, deleteRezervation } from '../controllers/rezervationController.js';

const router = express.Router();

router.route('/rezervations').get(getAllRezervations)
router.route('/rezervation/:id').get(getRezervation)
router.route('/rezervation/create').post(createRezervation)
router.route('/rezervation/update/:id').put(updateRezervation)
router.route('/rezervation/delete/:id').delete(deleteRezervation)

export default router;