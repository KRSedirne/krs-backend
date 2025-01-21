import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import ErrorHandler from '../utils/errorHandler.js';
import catchAsyncErrors from './catchAsyncErrors.js';

//authorization control
export const isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    console.log("token :", token);
    // const { token } = req?.cookies;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("decoded :", decoded);

    const user = await User.findOne({
      _id: decoded.id
    });

    console.log("user :", user);

    if (!user) {
      throw new ErrorHandler('user not found!!!', 404);
    }

    req.token = token;
    req.user = user;
    console.log("req.user on middleware :", req.user);
    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate' });
  }
});


export const isAdmin = catchAsyncErrors(async (req, res, next) => {
  try {
    if (!req.user || !req.user.role) {
      res.status(403).send({ success: false, message: "Access denied. No role information provided." });
    }
    if (req.user.role !== 'admin') {
      res.status(403).send({ success: false, message: "Access denied. Admins only." });
    }
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

