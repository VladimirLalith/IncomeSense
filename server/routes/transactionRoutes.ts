// server/routes/transactionRoutes.ts
import express from 'express';
import {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
} from '../controllers/transactionControllers';
import { protect } from '../middleware/authMiddleware'; // Import the protect middleware

const router = express.Router();

// Apply the protect middleware to all routes defined below in this router
router.use(protect); // This means all routes below require authentication

router.route('/').get(getTransactions).post(addTransaction);
router.route('/:id').put(updateTransaction).delete(deleteTransaction);

export default router;