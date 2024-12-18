import express from 'express';
import { getAllUsers, getUser, getUserProfile, updatePassword } from '../controllers/userController.js';
import { isAuthenticatedUser } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/user/profile').get(getUserProfile); // isAuthenticatedUser eklenecek
router.route('/user/password/update').put(updatePassword); // isAuthenticatedUser eklenecek
router.route('/users').get(isAuthenticatedUser, getAllUsers);
router.route('/user/:id').get(isAuthenticatedUser, getUser);

export default router; 