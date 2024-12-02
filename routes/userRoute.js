import express from 'express';
import { getAllUsers, getUser, updatePassword } from '../controllers/userController.js';
import { isAuthenticatedUser } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/users').get(isAuthenticatedUser, getAllUsers);
router.route('/user/:id').get(isAuthenticatedUser, getUser);
router.route('/user/password/update').put(isAuthenticatedUser, updatePassword);

export default router; 