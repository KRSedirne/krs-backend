import express from 'express';
import {adminCreateUser,adminDeleteUser,adminGetAllUsers,adminGetUser,adminUpdateUser } from '../controllers/Admin/adminUserController.js';
import { isAuthenticatedUser, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/user/create').post(isAuthenticatedUser,isAdmin,adminCreateUser);
router.route('/user/delete/:id').delete(isAuthenticatedUser,isAdmin,adminDeleteUser)
router.route('/user/update/:id').put(isAuthenticatedUser,isAdmin,adminUpdateUser)
router.route('/users').get(isAuthenticatedUser,isAdmin,adminGetAllUsers)
router.route('/user/:id').get(isAuthenticatedUser,isAdmin,adminGetUser)
export default router; 