import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import globalConfig from '../configs/globalConfig.js';
import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import sendMail from "../utils/mailSender.js";

const activeTokens = new Set();

export const register = catchAsyncErrors(async (req, res, next) => {
  try {
    const { email, password, name, lastname } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ErrorHandler('User already exists', 400));
    }

    // Create new user
    const user = new User({ name, lastname, email, password });
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      globalConfig.jwtSecret,
      { expiresIn: '1d' }
    );

    res.status(201).json({ token, user: { _id: user._id, email: user.email } });
  } catch (error) {
    return next(new ErrorHandler(`user couldn't registered. ${error.message}`, 400));
  }
});

export const login = catchAsyncErrors(async (req, res, next) => {
  try {
    const { email, password } = req.body;

    console.log(email, password);

    // Find user by email
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(new ErrorHandler('Invalid credentials', 401));
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return next(new ErrorHandler('Invalid credentials', 401));
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      globalConfig.jwtSecret,
      { expiresIn: '1d' }
    );

    res.status(200).json({ token, user: { _id: user._id, email: user.email }, success: true });
  } catch (error) {
    return next(new ErrorHandler(`user couldn't logged in. ${error.message}`, 400));
  }
});


export const logout = catchAsyncErrors(async (req, res, next) => {
  try {

    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return next(new ErrorHandler('No token found, please log in first', 401));
    }

    res.status(200).json({
      success: true,
      message: 'Successfully logged out. Token will be cleared on client side.',
    });
    
  } catch (error) {
    return next(new ErrorHandler(`Could not log out: ${error.message}`, 500));
  }
});

export const forgetPassword = catchAsyncErrors(async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return next(new ErrorHandler('User not found with this email', 404)); 
    }

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${user._id}`;

    const emailContent = `
      <p>Merhaba ${user.name},</p>
      <p>Sifre sifirlama talebinde bulundunuz. Sifrenizi sifirlamak icin asagidaki baglantiya tiklayin:</p>
      <a href="${resetLink}">Sifremi Sifirla</a>
      <p>Bu talebi siz yapmadiysaniz, lutfen bize ulasiniz</p>
    `;

    await sendMail(user.email, 'Sifre Sifirlama Talebi', emailContent);

    res.status(200).json({ message: 'Email reset link was sent!' });
  } catch (error) {
    return next(new ErrorHandler(`User couldn't send forgot password mail. ${error.message}`, 500));
  }
});

export const resetPassword = catchAsyncErrors(async (req, res, next) => {
  const { userId, newPassword } = req.body;

  try {
    const user = await User.findOne({ _id: userId })
    if (!user) {
      return next(new ErrorHandler('User not found with this ID', 404));
    }
    user.password = newPassword;
    await user.save(); // pre-save şifreyi otomatik olarak hasliyor burda

    res.status(200).json({ message: 'Password was reset succesfully!' });
  } catch (error) {
    return next(new ErrorHandler(`user couldn't reset password. ${error.message}`, 500));
  }
});
