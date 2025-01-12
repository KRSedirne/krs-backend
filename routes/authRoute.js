import express from 'express';
import { isAuthenticatedUser } from "../middlewares/authMiddleware.js";
import { login, register, logout, forgetPassword, resetPassword } from '../controllers/authController.js';

const router = express.Router();

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/logout').post(isAuthenticatedUser,logout)
router.route('/password/forget').post(forgetPassword);
router.route('/password/reset').post(resetPassword);

export default router; 