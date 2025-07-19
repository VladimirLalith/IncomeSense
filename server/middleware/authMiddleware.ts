// server/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/Users'; // To fetch the user if needed (optional, but good for robust checks)
import { Types } from 'mongoose'; // For ObjectId type

// Extend the Request interface to include the user property
// This is crucial for TypeScript to understand req.user in your controllers
declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: Types.ObjectId; // Make sure this matches the type in controllers
      };
    }
  }
}

const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token: string | undefined;

  // Check if Authorization header exists and starts with 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: string }; // Type the decoded payload

      // Attach user ID to the request object
      // We could fetch the full user: req.user = await User.findById(decoded.id).select('-password');
      // For simplicity and performance, we'll just attach the ID
      req.user = { _id: new Types.ObjectId(decoded.id) };

      next(); // Move to the next middleware/route handler
    } catch (error: any) {
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

export { protect };