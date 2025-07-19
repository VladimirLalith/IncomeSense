"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTransaction = exports.updateTransaction = exports.addTransaction = exports.getTransactions = void 0;
const Transactions_1 = __importDefault(require("../models/Transactions"));
// @desc    Get all transactions for a user
// @route   GET /api/transactions
// @access  Private
const getTransactions = async (req, res) => {
    try {
        const userId = req.user?._id; // Get user ID from authenticated request
        if (!userId) {
            return res.status(401).json({ message: 'Not authorized, no user ID found' });
        }
        // Find transactions belonging to the authenticated user, sorted by date descending
        const transactions = await Transactions_1.default.find({ user: userId }).sort({ date: -1 });
        res.status(200).json(transactions);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};
exports.getTransactions = getTransactions;
// @desc    Add a new transaction
// @route   POST /api/transactions
// @access  Private
const addTransaction = async (req, res) => {
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
        const newTransaction = await Transactions_1.default.create({
            user: userId,
            type,
            category,
            amount,
            date: date || Date.now(), // Use provided date or default to now
            description,
        });
        res.status(201).json(newTransaction);
    }
    catch (error) {
        console.error(error);
        // Handle Mongoose validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((val) => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};
exports.addTransaction = addTransaction;
// @desc    Update a transaction
// @route   PUT /api/transactions/:id
// @access  Private
const updateTransaction = async (req, res) => {
    const { id } = req.params; // Transaction ID from URL
    const { type, category, amount, date, description } = req.body;
    const userId = req.user?._id;
    if (!userId) {
        return res.status(401).json({ message: 'Not authorized, no user ID found' });
    }
    try {
        const transaction = await Transactions_1.default.findById(id);
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
    }
    catch (error) {
        console.error(error);
        if (error.name === 'CastError') { // For invalid ObjectId format
            return res.status(400).json({ message: 'Invalid transaction ID format' });
        }
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((val) => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};
exports.updateTransaction = updateTransaction;
// @desc    Delete a transaction
// @route   DELETE /api/transactions/:id
// @access  Private
const deleteTransaction = async (req, res) => {
    const { id } = req.params; // Transaction ID from URL
    const userId = req.user?._id;
    if (!userId) {
        return res.status(401).json({ message: 'Not authorized, no user ID found' });
    }
    try {
        const transaction = await Transactions_1.default.findById(id);
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        // Ensure the found transaction belongs to the authenticated user
        if (transaction.user.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this transaction' });
        }
        await Transactions_1.default.deleteOne({ _id: id }); // Use deleteOne for Mongoose 6+
        res.status(200).json({ message: 'Transaction removed' });
    }
    catch (error) {
        console.error(error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid transaction ID format' });
        }
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};
exports.deleteTransaction = deleteTransaction;
//# sourceMappingURL=transactionControllers.js.map