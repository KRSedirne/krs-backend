import express from 'express';
import { getAllUsers, getUserDetails, getUserProfile, updatePassword } from '../controllers/userController.js';
import { isAuthenticatedUser } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/users').get(isAuthenticatedUser, getAllUsers);
router.route('/user/profile').get(isAuthenticatedUser, getUserProfile);
router.route('/user/:id').get(isAuthenticatedUser, getUserDetails);
router.route('/user/password/update').put(isAuthenticatedUser, updatePassword);

export default router; 