// client/src/components/TransactionForm.tsx
import React, { useState, useEffect } from 'react';
// --- CORRECTED IMPORT BELOW ---
import type { TransactionData } from '../api/transactions'; // TransactionData is a type, must use 'import type'
// --- CORRECTED IMPORT ABOVE ---

interface TransactionFormProps {
  initialData?: TransactionData; // Optional, for editing existing transactions
  onSubmit: (transaction: Omit<TransactionData, '_id' | 'createdAt' | 'updatedAt' | 'user'>) => void;
  onCancel?: () => void; // Optional, for cancel button in edit mode
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
      alert('Amount must be positive');
      return;
    }
    onSubmit({ type, category, amount, date, description });
  };

  const incomeCategories = ['Salary', 'Freelance', 'Investments', 'Gift', 'Other Income'];
  const expenseCategories = ['Rent', 'Groceries', 'Utilities', 'Transport', 'Entertainment', 'Dining Out', 'Healthcare', 'Education', 'Shopping', 'Travel', 'Other Expense'];

  const availableCategories = type === 'income' ? incomeCategories : expenseCategories;

  return (
    <div style={{ padding: '20px', border: '1px solid #eee', borderRadius: '8px', marginBottom: '20px', backgroundColor: '#f9f9f9' }}>
      <h3>{isEditMode ? 'Edit Transaction' : 'Add New Transaction'}</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Type:</label>
          <select value={type} onChange={(e) => setType(e.target.value as 'income' | 'expense')} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Category:</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} required style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}>
            <option value="">Select a category</option>
            {availableCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Amount:</label>
          <input type="number" value={amount} onChange={(e) => setAmount(parseFloat(e.target.value))} required min="0.01" step="0.01" style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Date:</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Description (Optional):</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', resize: 'vertical' }}></textarea>
        </div>
        <button type="submit" style={{ padding: '10px 15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' }}>
          {isEditMode ? 'Update Transaction' : 'Add Transaction'}
        </button>
        {isEditMode && (
          <button type="button" onClick={onCancel} style={{ padding: '10px 15px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Cancel
          </button>
        )}
      </form>
    </div>
  );
};

export default TransactionForm;