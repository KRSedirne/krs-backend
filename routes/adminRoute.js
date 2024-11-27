import express from 'express';
import { getAllUsers, getUser, createUser, updateUser, deleteUser, updatePassword } from '../controllers/userController.js';
import { isAuthenticatedUser, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/user/create').post(isAuthenticatedUser,isAdmin,createUser);

export default router; 