import express from 'express';
import { getAllUsers, getUser, createUser, updateUser, deleteUser } from '../controllers/userController.js';

const router = express.Router();

router.route('/users').get(getAllUsers)
router.route('/user/:id').get(getUser)
//router.route('/user/create').post(createUser)
//router.route('/user/update/:id').put(updateUser)
//router.route('/user/delete/:id').delete(deleteUser)

export default router; 