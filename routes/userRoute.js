import express from 'express';
import { getAllUsers, getUser, updatePassword } from '../controllers/userController.js';
import { isAuthenticatedUser, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/users').get(isAuthenticatedUser, isAdmin, getAllUsers);
router.route('/user/:id').get(isAuthenticatedUser, isAdmin, getUser);
router.route('/user/password/update').put(isAuthenticatedUser, updatePassword);
// alttakiler auth'a çekilicek
router.route('/user/password/forget').post(forgetPassword);
router.route('/user/password/reset').post(resetPassword);


export default router; 