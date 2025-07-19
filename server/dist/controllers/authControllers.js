"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const Users_1 = __importDefault(require("../models/Users")); // Adjust the import path as necessary
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Utility function to generate JWT token
const generateToken = (id) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
    }
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1d', // Token expires in 1 day
    });
};
// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        // Check if user already exists
        let user = await Users_1.default.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }
        // Create new user
        user = await Users_1.default.create({
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
                token: generateToken(user._id),
            });
        }
        else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};
exports.registerUser = registerUser;
// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Check for user by email
        // Use .select('+password') to explicitly include the password field
        const user = await Users_1.default.findOne({ email }).select('+password');
        // If user not found or password doesn't match
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // If user found and password matches
        res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            token: generateToken(user._id),
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};
exports.loginUser = loginUser;
//# sourceMappingURL=authControllers.js.map