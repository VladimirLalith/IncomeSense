// server/controllers/authController.ts
import { Request, Response } from 'express';
import User, { IUser } from '../models/Users'; // Adjust the import path as necessary
import jwt from 'jsonwebtoken';
import mongoose, { HydratedDocument } from 'mongoose'; // For better type inference with Mongoose documents

// Utility function to generate JWT token
const generateToken = (id: mongoose.Types.ObjectId): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1d', // Token expires in 1 day
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    user = await User.create({
      username,
      email,
      password, // Password will be hashed by the pre-save hook
    });

    // Successfully created user
    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id as mongoose.Types.ObjectId),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Check for user by email
    // Use .select('+password') to explicitly include the password field
    const user = await User.findOne({ email }).select('+password') as HydratedDocument<IUser> | null;

    // If user not found or password doesn't match
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // If user found and password matches
    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id as mongoose.Types.ObjectId),
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};