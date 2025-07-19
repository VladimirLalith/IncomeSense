// server/controllers/transactionController.ts
import { Request, Response } from 'express';
import Transaction, { ITransaction } from '../models/Transactions';
import { Types } from 'mongoose'; // For ObjectId type

// Extend the Request type to include the 'user' property from authentication middleware
// We'll define this interface more formally when we create the auth middleware.
// For now, assume req.user._id will be available.
interface AuthRequest extends Request {
  user?: {
    _id: Types.ObjectId; // User ID from the authenticated token
  };
}

// @desc    Get all transactions for a user
// @route   GET /api/transactions
// @access  Private
export const getTransactions = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id; // Get user ID from authenticated request
    if (!userId) {
      return res.status(401).json({ message: 'Not authorized, no user ID found' });
    }

    // Find transactions belonging to the authenticated user, sorted by date descending
    const transactions = await Transaction.find({ user: userId }).sort({ date: -1 });

    res.status(200).json(transactions);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Add a new transaction
// @route   POST /api/transactions
// @access  Private
export const addTransaction = async (req: AuthRequest, res: Response) => {
  const { type, category, amount, date, description } = req.body;
  const userId = req.user?._id;

  if (!userId) {
    return res.status(401).json({ message: 'Not authorized, no user ID found' });
  }

  // Basic validation
  if (!type || !category || !amount) {
    return res.status(400).json({ message: 'Please include all required fields: type, category, and amount' });
  }

  if (amount <= 0) {
    return res.status(400).json({ message: 'Amount must be a positive number' });
  }

  try {
    const newTransaction = await Transaction.create({
      user: userId,
      type,
      category,
      amount,
      date: date || Date.now(), // Use provided date or default to now
      description,
    });

    res.status(201).json(newTransaction);
  } catch (error: any) {
    console.error(error);
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val: any) => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Update a transaction
// @route   PUT /api/transactions/:id
// @access  Private
export const updateTransaction = async (req: AuthRequest, res: Response) => {
  const { id } = req.params; // Transaction ID from URL
  const { type, category, amount, date, description } = req.body;
  const userId = req.user?._id;

  if (!userId) {
    return res.status(401).json({ message: 'Not authorized, no user ID found' });
  }

  try {
    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Ensure the found transaction belongs to the authenticated user
    if (transaction.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this transaction' });
    }

    // Update fields (only update if provided in the request body)
    transaction.type = type || transaction.type;
    transaction.category = category || transaction.category;
    transaction.amount = amount || transaction.amount;
    transaction.date = date || transaction.date;
    transaction.description = description !== undefined ? description : transaction.description; // Allow setting description to empty string

    const updatedTransaction = await transaction.save(); // Save the updated transaction

    res.status(200).json(updatedTransaction);
  } catch (error: any) {
    console.error(error);
    if (error.name === 'CastError') { // For invalid ObjectId format
      return res.status(400).json({ message: 'Invalid transaction ID format' });
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val: any) => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Delete a transaction
// @route   DELETE /api/transactions/:id
// @access  Private
export const deleteTransaction = async (req: AuthRequest, res: Response) => {
  const { id } = req.params; // Transaction ID from URL
  const userId = req.user?._id;

  if (!userId) {
    return res.status(401).json({ message: 'Not authorized, no user ID found' });
  }

  try {
    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Ensure the found transaction belongs to the authenticated user
    if (transaction.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this transaction' });
    }

    await Transaction.deleteOne({ _id: id }); // Use deleteOne for Mongoose 6+

    res.status(200).json({ message: 'Transaction removed' });
  } catch (error: any) {
    console.error(error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid transaction ID format' });
    }
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};