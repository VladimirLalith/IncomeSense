// F:\IncomeSense\client\src\components\TransactionForm.tsx
import React, { useState, useEffect } from 'react';
import type { TransactionData } from '../api/transactions';

interface TransactionFormProps {
  initialData?: TransactionData;
  onSubmit: (transaction: Omit<TransactionData, '_id' | 'createdAt' | 'updatedAt' | 'user'>) => void;
  onCancel?: () => void;
  isEditMode?: boolean;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ initialData, onSubmit, onCancel, isEditMode = false }) => {
  const [type, setType] = useState<'income' | 'expense'>(initialData?.type || 'expense');
  const [category, setCategory] = useState<string>(initialData?.category || '');
  const [amount, setAmount] = useState<number>(initialData?.amount || 0);
  const [date, setDate] = useState<string>(initialData?.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState<string>(initialData?.description || '');

  useEffect(() => {
    if (initialData) {
      setType(initialData.type);
      setCategory(initialData.category);
      setAmount(initialData.amount);
      setDate(new Date(initialData.date).toISOString().split('T')[0]);
      setDescription(initialData.description || '');
    } else {
      setType('expense');
      setCategory('');
      setAmount(0);
      setDate(new Date().toISOString().split('T')[0]);
      setDescription('');
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) {
      alert('Amount must be positive'); // Consider replacing with a Bootstrap modal
      return;
    }
    onSubmit({ type, category, amount, date, description });
  };

  const incomeCategories = ['Salary', 'Freelance', 'Investments', 'Gift', 'Other Income'];
  const expenseCategories = ['Rent', 'Groceries', 'Utilities', 'Transport', 'Entertainment', 'Dining Out', 'Healthcare', 'Education', 'Shopping', 'Travel', 'Other Expense'];

  const availableCategories = type === 'income' ? incomeCategories : expenseCategories;

  return (
    <div className="card shadow-sm p-4 mb-4">
      <div className="card-body">
        <h4 className="card-title mb-3">{isEditMode ? 'Edit Transaction' : 'Add New Transaction'}</h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="transactionType" className="form-label">Type:</label>
            <select
              id="transactionType"
              value={type}
              onChange={(e) => setType(e.target.value as 'income' | 'expense')}
              className="form-select"
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="transactionCategory" className="form-label">Category:</label>
            <select
              id="transactionCategory"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="form-select"
              required
            >
              <option value="">Select a category</option>
              {availableCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="transactionAmount" className="form-label">Amount:</label>
            <input
              type="number"
              id="transactionAmount"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
              className="form-control"
              required
              min="0.01"
              step="0.01"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="transactionDate" className="form-label">Date:</label>
            <input
              type="date"
              id="transactionDate"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="form-control"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="transactionDescription" className="form-label">Description (Optional):</label>
            <textarea
              id="transactionDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="form-control"
            ></textarea>
          </div>
          <div className="d-flex justify-content-end">
            {isEditMode && (
              <button
                type="button"
                onClick={onCancel}
                className="btn btn-secondary me-2"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className={`btn ${isEditMode ? 'btn-primary' : 'btn-success'}`}
            >
              {isEditMode ? 'Update Transaction' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;
