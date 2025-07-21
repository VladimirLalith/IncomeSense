/* eslint-disable @typescript-eslint/no-explicit-any */
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

// Chart.js Imports
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title as ChartTitle } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

// Register Chart.js components (IMPORTANT: Do this once at the top level or in a common file)
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, ChartTitle);

import TransactionList from '../components/TransactionList';
import TransactionForm from '../components/TransactionForm';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
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
      if (transactionDate.getMonth() + 1 === selectedMonth && transactionDate.getFullYear() === selectedYear) {
         setTransactions((prev) => [addedTransaction, ...prev]);
      } else {
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

  // Calculate Savings Rate
  const savingsRate = useMemo(() => {
    if (totalIncome === 0) return 0; // Avoid division by zero
    const savedAmount = totalIncome - totalExpense; // Simple savings: Income - Expense
    return ((savedAmount / totalIncome) * 100).toFixed(2);
  }, [totalIncome, totalExpense]);


  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    name: new Date(0, i).toLocaleString('default', { month: 'long' }),
  }));
  const years = Array.from({ length: 5 }, (_, i) => today.getFullYear() - 2 + i);

  // --- Chart Data Preparation ---

  // Expense Categories Pie Chart Data
  const expenseCategories = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc: { [key: string]: number }, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const pieChartData = {
    labels: Object.keys(expenseCategories),
    datasets: [
      {
        label: 'Amount ($)',
        data: Object.values(expenseCategories),
        backgroundColor: [
          'rgba(255, 0, 0, 0.7)', // Red
          'rgba(255, 255, 255, 0.7)', // White
          'rgba(0, 230, 118, 0.7)', // Green
          'rgba(255, 160, 0, 0.7)', // Orange (secondary accent)
          'rgba(153, 102, 255, 0.7)', // Purple (secondary accent)
          'rgba(54, 162, 235, 0.7)', // Blue (secondary accent)
        ],
        borderColor: [
          'rgba(255, 0, 0, 1)',
          'rgba(255, 255, 255, 1)',
          'rgba(0, 230, 118, 1)',
          'rgba(255, 160, 0, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(54, 162, 235, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#ffffff', // White legend text for dark background
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed !== null) {
              label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed);
            }
            return label;
          }
        }
      }
    },
  };

  // Monthly Income/Expense Trend Bar Chart Data
  const monthlyData = useMemo(() => {
    const dataByMonth: { [key: string]: { income: number; expense: number } } = {};
    // Aggregate all transactions (not just filtered) to show a trend over time
    transactions.forEach(t => {
      const date = new Date(t.date);
      const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`;
      if (!dataByMonth[monthYear]) {
        dataByMonth[monthYear] = { income: 0, expense: 0 };
      }
      if (t.type === 'income') {
        dataByMonth[monthYear].income += t.amount;
      } else {
        dataByMonth[monthYear].expense += t.amount;
      }
    });

    const sortedMonths = Object.keys(dataByMonth).sort((a, b) => {
      const [yearA, monthA] = a.split('-').map(Number);
      const [yearB, monthB] = b.split('-').map(Number);
      if (yearA !== yearB) return yearA - yearB;
      return monthA - monthB;
    });

    const labels = sortedMonths.map(my => {
      const [year, month] = my.split('-');
      return new Date(Number(year), Number(month) - 1).toLocaleString('default', { month: 'short', year: '2-digit' });
    });

    const incomes = sortedMonths.map(my => dataByMonth[my].income);
    const expenses = sortedMonths.map(my => dataByMonth[my].expense);

    return { labels, incomes, expenses };
  }, [transactions]);


  const barChartData = {
    labels: monthlyData.labels,
    datasets: [
      {
        label: 'Income',
        data: monthlyData.incomes,
        backgroundColor: 'rgba(0, 230, 118, 0.7)', // Green for income
        borderColor: 'rgba(0, 230, 118, 1)',
        borderWidth: 1,
      },
      {
        label: 'Expense',
        data: monthlyData.expenses,
        backgroundColor: 'rgba(255, 0, 0, 0.7)', // Red for expense
        borderColor: 'rgba(255, 0, 0, 1)',
        borderWidth: 1,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#ffffff', // White legend text for dark background
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#ffffff', // X-axis labels color for dark theme
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)', // Grid line color for dark theme
        },
      },
      y: {
        ticks: {
          color: '#ffffff', // Y-axis labels color for dark theme
          callback: function(value: any) {
            return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)', // Grid line color for dark theme
        },
      },
    },
  };

  // --- End Chart Data Preparation ---


  const handleNotifications = () => {
    alert('Notifications clicked!'); // Replace with actual notification display logic
  };

  const handleSettings = () => {
    alert('Settings clicked!'); // Replace with actual settings modal/page navigation
  };

  return (
    <div className="container-fluid py-4">
      {/* Top Bar / Header Section - Mimicking Bronx Club's top bar */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 text-bronx-main fw-bold mb-0">Dashboard</h1> {/* Changed text-dark-main to text-bronx-main */}
        <div className="d-flex align-items-center">
          {user && (
            <div className="d-flex align-items-center me-3">
              <i className="fas fa-user-circle fs-4 text-bronx-muted me-2"></i> {/* Changed text-dark-muted to text-bronx-muted */}
              <span className="text-bronx-main fw-semibold">{user.username}</span> {/* Changed text-dark-main to text-bronx-main */}
            </div>
          )}
          <button className="btn btn-bronx-secondary btn-sm me-2" onClick={handleNotifications}> {/* Changed class */}
            <i className="fas fa-bell"></i>
          </button>
          <button className="btn btn-bronx-secondary btn-sm me-2" onClick={handleSettings}> {/* Changed class */}
            <i className="fas fa-cog"></i>
          </button>
          <button className="btn btn-bronx-primary btn-sm" onClick={logout}> {/* Changed class */}
            <i className="fas fa-sign-out-alt me-1"></i> Logout
          </button>
        </div>
      </div>

      {loading && !transactions.length && <p className="text-center text-bronx-muted">Loading transactions...</p>} {/* Changed text-dark-muted to text-bronx-muted */}
      {error && <div className="alert alert-bronx-danger text-sm mb-4" role="alert">{error}</div>} {/* Changed alert-dark-danger to alert-bronx-danger */}

      {/* Summary Cards Section - Top Row like Bronx Club's stats */}
      <div className="row g-4 mb-4">
        {/* Total Income Card */}
        <div className="col-lg-3 col-md-6 col-sm-12">
          <div className="card bronx-card stats-card"> {/* Changed class */}
            <div className="card-body">
              <div>
                <div className="text-label text-bronx-muted">Total Income</div> {/* Changed class */}
                <div className="text-value text-success">${totalIncome.toFixed(2)}</div>
              </div>
              <div className="icon-square bg-success">
                <i className="fas fa-arrow-up"></i>
              </div>
            </div>
          </div>
        </div>
        {/* Total Expense Card */}
        <div className="col-lg-3 col-md-6 col-sm-12">
          <div className="card bronx-card stats-card"> {/* Changed class */}
            <div className="card-body">
              <div>
                <div className="text-label text-bronx-muted">Total Expense</div> {/* Changed class */}
                <div className="text-value text-danger">${totalExpense.toFixed(2)}</div>
              </div>
              <div className="icon-square bg-danger">
                <i className="fas fa-arrow-down"></i>
              </div>
            </div>
          </div>
        </div>
        {/* Net Balance Card */}
        <div className="col-lg-3 col-md-6 col-sm-12">
          <div className="card bronx-card stats-card"> {/* Changed class */}
            <div className="card-body">
              <div>
                <div className="text-label text-bronx-muted">Net Balance</div> {/* Changed class */}
                <div className="text-value text-info">${balance.toFixed(2)}</div>
              </div>
              <div className={`icon-square ${balance >= 0 ? 'bg-info' : 'bg-danger'}`}>
                <i className={`fas ${balance >= 0 ? 'fa-balance-scale' : 'fa-exclamation-triangle'}`}></i>
              </div>
            </div>
          </div>
        </div>
        {/* Savings Rate Card */}
        <div className="col-lg-3 col-md-6 col-sm-12">
          <div className="card bronx-card stats-card"> {/* Changed class */}
            <div className="card-body">
              <div>
                <div className="text-label text-bronx-muted">Savings Rate</div> {/* Changed class */}
                <div className="text-value text-bronx-main">{savingsRate}%</div> {/* Changed class */}
              </div>
              <div className="icon-square bg-primary">
                <i className="fas fa-piggy-bank"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Main Content Area */}
      <div className="row g-4 mb-4">
        {/* Left Column for Charts/Insights */}
        <div className="col-lg-8">
          <div className="card bronx-card mb-4"> {/* Changed class */}
            <div className="card-header">
              <h5 className="card-title text-bronx-main mb-0">Monthly Financial Summary</h5> {/* Changed class */}
            </div>
            <div className="card-body">
              {monthlyData.labels.length > 0 ? (
                <div style={{ maxHeight: '350px', maxWidth: '100%', margin: 'auto' }}>
                  <Bar data={barChartData} options={barChartOptions} />
                </div>
              ) : (
                <p className="text-center text-bronx-muted">No income or expense data to show trend for the selected period.</p> 
              )}
            </div>
          </div>

          <div className="card bronx-card"> {/* Changed class */}
            <div className="card-header">
              <h5 className="card-title text-bronx-main mb-0">Expense Breakdown by Category</h5> {/* Changed class */}
            </div>
            <div className="card-body">
              {Object.keys(expenseCategories).length > 0 ? (
                <div style={{ maxHeight: '350px', maxWidth: '350px', margin: 'auto' }}>
                  <Pie data={pieChartData} options={pieChartOptions} />
                </div>
              ) : (
                <p className="text-center text-bronx-muted">No expense data to display for the selected period.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column for Transaction Form / Recent Activity */}
        <div className="col-lg-4">
          <div className="card bronx-card mb-4"> {/* Changed class */}
            <div className="card-header">
              <h5 className="card-title text-bronx-main mb-0">Manage Transactions</h5> {/* Changed class */}
            </div>
            <div className="card-body">
              <div className="d-flex flex-column flex-sm-row gap-3 align-items-center mb-4">
                <div>
                  <label htmlFor="month-select" className="form-label mb-0 me-2 text-bronx-muted">View Month:</label> {/* Changed class */}
                  <select
                    id="month-select"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(Number(e.target.value))}
                    className="form-select form-control-bronx d-inline-block w-auto" // Changed class
                  >
                    {months.map((month) => (
                      <option key={month.value} value={month.value}>
                        {month.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="year-select" className="form-label mb-0 me-2 text-bronx-muted">View Year:</label> {/* Changed class */}
                  <select
                    id="year-select"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    className="form-select form-control-bronx d-inline-block w-auto" // Changed class
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
          </div>
        </div>
      </div>

      {/* Full-width Recent Transactions List */}
      <div className="row">
        <div className="col-12">
          <div className="card bronx-card"> {/* Changed class */}
            <div className="card-header">
              <h5 className="card-title text-bronx-main mb-0">Recent Transactions</h5> {/* Changed class */}
            </div>
            <div className="card-body">
              <TransactionList
                transactions={filteredTransactions}
                onEdit={startEditTransaction}
                onDelete={handleDeleteTransaction}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
