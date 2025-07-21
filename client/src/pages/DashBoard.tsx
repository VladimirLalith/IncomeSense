// F:\IncomeSense\client\src\pages\Dashboard.tsx
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


import TransactionList from '../components/TransactionList';
import TransactionForm from '../components/TransactionForm';

const Dashboard: React.FC = () => {
  const { user } = useAuth(); // Removed logout from here as it's in Sidebar
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
      let loggableError: string | unknown = err;

      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.message || err.message || errorMessage;
        loggableError = errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message || errorMessage;
      }
      setError(errorMessage);
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
      // Only add to current view if it matches selected month/year, otherwise just update the full list.
      if (transactionDate.getMonth() + 1 === selectedMonth && transactionDate.getFullYear() === selectedYear) {
         setTransactions((prev) => [addedTransaction, ...prev]);
      } else {
        // If it's for a different month/year, we still want it in the overall transactions state
        // for when the user switches months. A full refetch might be simpler here too.
        setTransactions((prev) => [addedTransaction, ...prev]);
      }
      setEditingTransaction(null);
    } catch (err: unknown) {
      let errorMessage = 'Failed to add transaction.';
      let loggableError: string | unknown = err;

      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.message || err.message || errorMessage;
        loggableError = errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message || errorMessage;
      }
      setError(errorMessage);
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
      let loggableError: string | unknown = err;

      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.message || err.message || errorMessage;
        loggableError = errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message || errorMessage;
      }
      setError(errorMessage);
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
      let loggableError: string | unknown = err;

      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.message || err.message || errorMessage;
        loggableError = errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message || errorMessage;
      }
      setError(errorMessage);
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
    <div className="p-6 bg-white rounded-lg shadow-md min-h-full">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6 border-b pb-4">
        Financial Overview
      </h1>

      {(loading && !transactions.length) && <p className="text-center text-gray-600">Loading transactions...</p>}
      {error && <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-sm">{error}</p>}

      {/* Summary Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-green-100 p-6 rounded-lg shadow-md flex flex-col justify-between transform hover:scale-105 transition-transform duration-200">
          <h3 className="text-xl font-semibold text-green-700 mb-2">Total Income</h3>
          <p className="text-4xl font-bold text-green-800">${totalIncome.toFixed(2)}</p>
        </div>
        <div className="bg-red-100 p-6 rounded-lg shadow-md flex flex-col justify-between transform hover:scale-105 transition-transform duration-200">
          <h3 className="text-xl font-semibold text-red-700 mb-2">Total Expense</h3>
          <p className="text-4xl font-bold text-red-800">${totalExpense.toFixed(2)}</p>
        </div>
        <div className={`p-6 rounded-lg shadow-md flex flex-col justify-between transform hover:scale-105 transition-transform duration-200 ${balance >= 0 ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
          <h3 className="text-xl font-semibold mb-2">Net Balance</h3>
          <p className={`text-4xl font-bold ${balance >= 0 ? 'text-blue-800' : 'text-red-800'}`}>${balance.toFixed(2)}</p>
        </div>
      </div>

      {/* Filters and Transaction Form Section */}
      <div className="mb-8 p-6 bg-gray-50 rounded-lg shadow-inner">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Manage Transactions</h3>
        <div className="flex flex-col sm:flex-row gap-4 items-center mb-6">
          <div>
            <label htmlFor="month-select" className="block text-gray-700 text-sm font-bold mb-1">View Month:</label>
            <select
              id="month-select"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {months.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="year-select" className="block text-gray-700 text-sm font-bold mb-1">View Year:</label>
            <select
              id="year-select"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        <TransactionForm
          initialData={editingTransaction || undefined}
          onSubmit={editingTransaction ? handleUpdateTransaction : handleAddTransaction}
          onCancel={cancelEdit}
          isEditMode={!!editingTransaction}
        />
      </div>

      {/* Transaction List Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Transactions for {months.find(m => m.value === selectedMonth)?.name} {selectedYear}</h3>
        {filteredTransactions.length === 0 && !loading && !error && (
          <p className="text-center text-gray-600">No transactions found for this period.</p>
        )}
        <TransactionList
          transactions={filteredTransactions}
          onEdit={startEditTransaction}
          onDelete={handleDeleteTransaction}
        />
      </div>
    </div>
  );
};

export default Dashboard;