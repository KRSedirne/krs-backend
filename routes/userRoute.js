import express from 'express';
import { getAllUsers, getUser,  updatePassword } from '../controllers/userController.js';
import { isAuthenticatedUser, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/users').get(isAuthenticatedUser,isAdmin,getAllUsers)
router.route('/user/:id').get(isAuthenticatedUser,isAdmin,getUser)
router.route('/user/updatePassword').put(isAuthenticatedUser,updatePassword)


export default router; 