"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = require("mongoose"); // For ObjectId type
const protect = async (req, res, next) => {
    let token;
    // Check if Authorization header exists and starts with 'Bearer'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];
            // Verify token
            if (!process.env.JWT_SECRET) {
                throw new Error('JWT_SECRET is not defined');
            }
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET); // Type the decoded payload
            // Attach user ID to the request object
            // We could fetch the full user: req.user = await User.findById(decoded.id).select('-password');
            // For simplicity and performance, we'll just attach the ID
            req.user = { _id: new mongoose_1.Types.ObjectId(decoded.id) };
            next(); // Move to the next middleware/route handler
        }
        catch (error) {
            console.error(error);
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token expired, please log in again' });
            }
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({ message: 'Invalid token, not authorized' });
            }
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }
    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};
exports.protect = protect;
//# sourceMappingURL=authMiddleware.js.map