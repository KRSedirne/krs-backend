import express from 'express';
import { getAllUsers, getUser, updateUser, deleteUser, updatePassword } from '../controllers/userController.js';
import { isAuthenticatedUser, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/users').get(isAuthenticatedUser,isAdmin,getAllUsers)
router.route('/user/:id').get(isAuthenticatedUser,isAdmin,getUser)
router.route('/user/update/:id').put(isAuthenticatedUser,isAdmin,updateUser)
router.route('/user/updatePassword').put(isAuthenticatedUser,updatePassword)
router.route('/user/delete/:id').delete(isAuthenticatedUser,isAdmin,deleteUser)


export default router; 