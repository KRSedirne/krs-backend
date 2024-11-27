import User from '../models/user.js'
import jwt from 'jsonwebtoken'
import { generateId } from '../utils/idGenerator.js'
import globalConfig from '../configs/globalConfig.js';

export const register = async (req, res) => {
  try {
    const id = generateId();
    const { name, lastname, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = new User({ id, name, lastname, email, password, });
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      globalConfig.jwtSecret,
      { expiresIn: '1d' }
    );

    res.status(201).json({ token, user: { id: user._id, email: user.email } });
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

    console.log("user: ", user);
    console.log("isMatch: ", isMatch);
    console.log("user id: ", user._id);
    console.log("user email: ", user.email);
    console.log("globalConfig: ", globalConfig.jwtSecret);



    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      globalConfig.jwtSecret,
      { expiresIn: '1d' }
    );

    console.log(token);

    res.json({ token, user: { id: user._id, email: user.email } });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};