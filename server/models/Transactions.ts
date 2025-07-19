// server/models/Transaction.ts
import mongoose, { Document, Schema, Types } from 'mongoose';

// Define an interface for the Transaction document
export interface ITransaction extends Document {
  user: Types.ObjectId; // Reference to the User who owns this transaction
  type: 'income' | 'expense'; // Type of transaction
  category: string; // E.g., 'Salary', 'Rent', 'Groceries', 'Utilities'
  amount: number;
  date: Date;
  description?: string; // Optional description
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema: Schema<ITransaction> = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User', // References the 'User' model
      required: true,
    },
    type: {
      type: String,
      enum: ['income', 'expense'], // Enforce 'income' or 'expense'
      required: [true, 'Transaction type is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount must be a positive number'], // Prevent negative amounts
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      default: Date.now, // Default to current date if not provided
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, 'Description cannot be more than 200 characters'],
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Add an index for faster querying by user and date
TransactionSchema.index({ user: 1, date: -1 });

const Transaction = mongoose.model<ITransaction>('Transaction', TransactionSchema);

export default Transaction;