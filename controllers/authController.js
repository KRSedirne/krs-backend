import User from '../models/user.js'
import jwt from 'jsonwebtoken'
import globalConfig from '../configs/globalConfig.js';

export const register = async (req, res) => {
  try {
    const id = generateId();
    const { email, password, name, lastname,role } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = new User({ id, password, name, lastname,role });
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email }, 
      globalConfig.jwtKey, 
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
    
    // Find user by email
    const user = await User.findOne({ email });
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

    res.json({ token, user: { id: user._id, email: user.email } });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};