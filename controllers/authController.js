import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import globalConfig from '../configs/globalConfig.js';

const activeTokens = new Set();

export const register = async (req, res) => {
  try {
    const { email, password, name, lastname } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
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
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log(email, password); // Ebrar@hotmail.com 1234567

    // Find user by email
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      globalConfig.jwtKey,
      { expiresIn: '1d' }
    );

    res.status(200).cookie('token', token, { httpOnly: true }).json({ token, user: { _id: user._id, email: user.email } });
    // res.json({ token, user: { id: user._id, email: user.email } });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(400).json({ succes: false, message: 'Not token found.User is already logged out.' });
    }
    activeTokens.delete(token);
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', //https ortamında çalışırken true olmalı
      sameSite: 'strict', //CSRF korumasi için
    }).json({ message: 'Logged out successfuly' });
  } catch (error) {
    res.status(500).json({ succes: false, message: "Logout failed", error: error.message });
  }
}
