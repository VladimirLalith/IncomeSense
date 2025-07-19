// client/src/pages/Dashboard.tsx
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import {
  getTransactions as apiGetTransactions,
  addTransaction as apiAddTransaction,
  updateTransaction as apiUpdateTransaction,
  deleteTransaction as apiDeleteTransaction,
} from '../api/transactions';
import type { TransactionData } from '../api/transactions';
import axios from 'axios';
//import type { AxiosError } from 'axios';

import TransactionList from '../components/TransactionList';
import TransactionForm from '../components/TransactionForm';

const Dashboard: React.FC = () => {
  const { user, logout, error: authError } = useAuth();
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingTransaction, setEditingTransaction] = useState<TransactionData | null>(null);

  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState<number>(today.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(today.getFullYear());

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiGetTransactions();
      setTransactions(data);
    } catch (err: unknown) {
      let errorMessage = 'Failed to fetch transactions.';
      let loggableError: string | unknown = err; // Variable to safely log the error

      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.message || err.message || errorMessage;
        loggableError = errorMessage; // Log the specific message for AxiosError
      } else if (err instanceof Error) {
        errorMessage = err.message || errorMessage;
        loggableError = errorMessage; // Log the specific message for standard Error
      }
      setError(errorMessage);
      // --- FIX: Log the error safely using the loggableError variable ---
      console.error("Error fetching transactions:", loggableError);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user, fetchTransactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return (
        transactionDate.getMonth() + 1 === selectedMonth &&
        transactionDate.getFullYear() === selectedYear
      );
    });
  }, [transactions, selectedMonth, selectedYear]);

  const handleAddTransaction = async (newTransactionData: Omit<TransactionData, '_id' | 'createdAt' | 'updatedAt' | 'user'>) => {
    setLoading(true);
    setError(null);
    try {
      const addedTransaction = await apiAddTransaction(newTransactionData);
      const transactionDate = new Date(addedTransaction.date);
      if (transactionDate.getMonth() + 1 === selectedMonth && transactionDate.getFullYear() === selectedYear) {
         setTransactions((prev) => [addedTransaction, ...prev]);
      } else {
        setTransactions((prev) => [addedTransaction, ...prev]);
      }
      setEditingTransaction(null);
    } catch (err: unknown) {
      let errorMessage = 'Failed to add transaction.';
      let loggableError: string | unknown = err; // Variable to safely log the error

      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.message || err.message || errorMessage;
        loggableError = errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message || errorMessage;
      }
      setError(errorMessage);
      // --- FIX: Log the error safely ---
      console.error("Error adding transaction:", loggableError);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTransaction = async (updatedTransactionData: Omit<TransactionData, '_id' | 'createdAt' | 'updatedAt' | 'user'>) => {
    if (!editingTransaction?._id) return;

    setLoading(true);
    setError(null);
    try {
      const response = await apiUpdateTransaction(editingTransaction._id, updatedTransactionData);
      setTransactions((prev) =>
        prev.map((t) => (t._id === response._id ? response : t))
      );
      setEditingTransaction(null);
    } catch (err: unknown) {
      let errorMessage = 'Failed to update transaction.';
      let loggableError: string | unknown = err; // Variable to safely log the error

      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.message || err.message || errorMessage;
        loggableError = errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message || errorMessage;
      }
      setError(errorMessage);
      // --- FIX: Log the error safely ---
      console.error("Error updating transaction:", loggableError);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await apiDeleteTransaction(id);
      setTransactions((prev) => prev.filter((t) => t._id !== id));
    } catch (err: unknown) {
      let errorMessage = 'Failed to delete transaction.';
      let loggableError: string | unknown = err; // Variable to safely log the error

      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.message || err.message || errorMessage;
        loggableError = errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message || errorMessage;
      }
      setError(errorMessage);
      // --- FIX: Log the error safely ---
      console.error("Error deleting transaction:", loggableError);
    } finally {
      setLoading(false);
    }
  };

  const startEditTransaction = (transaction: TransactionData) => {
    setEditingTransaction(transaction);
  };

  const cancelEdit = () => {
    setEditingTransaction(null);
  };

  const totalIncome = filteredTransactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = filteredTransactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = totalIncome - totalExpense;

  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    name: new Date(0, i).toLocaleString('default', { month: 'long' }),
  }));
  const years = Array.from({ length: 5 }, (_, i) => today.getFullYear() - 2 + i);

  return (
    <div style={{ maxWidth: '900px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', backgroundColor: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Welcome to IncomeSense, {user?.username}!</h2>
        <button onClick={logout} style={{ padding: '8px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Logout
        </button>
      </div>

      {(loading && !transactions.length) && <p style={{ textAlign: 'center' }}>Loading transactions...</p>}
      {(error || authError) && <p style={{ color: 'red', textAlign: 'center' }}>Error: {error || authError}</p>}

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <label htmlFor="month-select">View Month:</label>
        <select
          id="month-select"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
        >
          {months.map((month) => (
            <option key={month.value} value={month.value}>
              {month.name}
            </option>
          ))}
        </select>

        <label htmlFor="year-select">View Year:</label>
        <select
          id="year-select"
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-around', margin: '20px 0', padding: '15px', border: '1px dashed #ddd', borderRadius: '8px', backgroundColor: '#f0f8ff' }}>
        <h3 style={{ color: '#28a745' }}>Income: ${totalIncome.toFixed(2)}</h3>
        <h3 style={{ color: '#dc3545' }}>Expense: ${totalExpense.toFixed(2)}</h3>
        <h3 style={{ color: balance >= 0 ? '#17a2b8' : '#dc3545' }}>Balance: ${balance.toFixed(2)}</h3>
      </div>

      <TransactionForm
        initialData={editingTransaction || undefined}
        onSubmit={editingTransaction ? handleUpdateTransaction : handleAddTransaction}
        onCancel={cancelEdit}
        isEditMode={!!editingTransaction}
      />

      <TransactionList
        transactions={filteredTransactions}
        onEdit={startEditTransaction}
        onDelete={handleDeleteTransaction}
      />
    </div>
  );
};

export default Dashboard;