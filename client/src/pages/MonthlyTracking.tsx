/* eslint-disable @typescript-eslint/no-explicit-any */
// F:\IncomeSense\client\src\pages\MonthlyTracking.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title as ChartTitle } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import axios from 'axios';

import { getTransactions } from '../api/transactions'; // Assuming you can fetch all transactions
import type { TransactionData } from '../api/transactions';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, ChartTitle);

const MonthlyTracking: React.FC = () => {
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState<number>(today.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(today.getFullYear());

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTransactions(); // Fetch all transactions
      setTransactions(data);
    } catch (err: unknown) {
      let errorMessage = 'Failed to fetch transactions for tracking.';
      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.message || err.message || errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message || errorMessage;
      }
      setError(errorMessage);
      console.error("Error fetching tracking data:", err instanceof Error ? err.message : err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Filter transactions by selected month/year
  const filteredTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return (
      transactionDate.getMonth() + 1 === selectedMonth &&
      transactionDate.getFullYear() === selectedYear
    );
  });

  // Prepare data for Expense Categories Pie Chart
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
          'rgba(255, 99, 132, 0.7)', // Red
          'rgba(54, 162, 235, 0.7)', // Blue
          'rgba(255, 206, 86, 0.7)', // Yellow
          'rgba(75, 192, 192, 0.7)', // Green
          'rgba(153, 102, 255, 0.7)', // Purple
          'rgba(255, 159, 64, 0.7)', // Orange
          'rgba(199, 199, 199, 0.7)', // Grey
          'rgba(83, 102, 255, 0.7)', // Indigo
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(199, 199, 199, 1)',
          'rgba(83, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Prepare data for Income vs Expense Trend Bar Chart (dummy data for now)
  const monthlyData = useMemo(() => {
    const dataByMonth: { [key: string]: { income: number; expense: number } } = {};
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
        backgroundColor: 'rgba(75, 192, 192, 0.7)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Expense',
        data: monthlyData.expenses,
        backgroundColor: 'rgba(255, 99, 132, 0.7)',
        borderColor: 'rgba(255, 99, 132, 1)',
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
          color: '#e0e0e0', // Legend text color for dark theme
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
          color: '#e0e0e0', // X-axis labels color for dark theme
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)', // Grid line color for dark theme
        },
      },
      y: {
        ticks: {
          color: '#e0e0e0', // Y-axis labels color for dark theme
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

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#e0e0e0', // Legend text color for dark theme
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


  const monthsOptions = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    name: new Date(0, i).toLocaleString('default', { month: 'long' }),
  }));
  const yearsOptions = Array.from({ length: 5 }, (_, i) => today.getFullYear() - 2 + i);


  return (
    <div className="container-fluid py-4">
      <h1 className="mb-4 text-dark-main fw-bold border-bottom pb-3">
        Monthly Tracking & Analytics
      </h1>

      {loading && <p className="text-center text-dark-muted">Loading analytics...</p>}
      {error && <div className="alert alert-dark-danger text-sm mb-4" role="alert">{error}</div>}

      <div className="row g-4 mb-4">
        {/* Month/Year Filter */}
        <div className="col-12">
          <div className="card dark-theme-card shadow-sm p-3">
            <div className="card-body d-flex flex-column flex-sm-row gap-3 align-items-center">
              <div>
                <label htmlFor="trackingMonth" className="form-label mb-0 me-2">Select Month:</label>
                <select
                  id="trackingMonth"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  className="form-select form-control-dark d-inline-block w-auto"
                >
                  {monthsOptions.map((month) => (
                    <option key={month.value} value={month.value}>
                      {month.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="trackingYear" className="form-label mb-0 me-2">Select Year:</label>
                <select
                  id="trackingYear"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="form-select form-control-dark d-inline-block w-auto"
                >
                  {yearsOptions.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Expense Categories Breakdown Chart */}
        <div className="col-lg-6">
          <div className="card dark-theme-card shadow-sm h-100">
            <div className="card-header">
              <h4 className="card-title text-dark-main mb-0 text-center">Expense Categories Breakdown</h4>
            </div>
            <div className="card-body d-flex justify-content-center align-items-center">
              {Object.keys(expenseCategories).length > 0 ? (
                <div style={{ maxHeight: '350px', maxWidth: '350px', margin: 'auto' }}>
                  <Pie data={pieChartData} options={pieChartOptions} />
                </div>
              ) : (
                <p className="text-center text-dark-muted">No expense data for {monthsOptions.find(m => m.value === selectedMonth)?.name} {selectedYear}.</p>
              )}
            </div>
          </div>
        </div>

        {/* Income vs Expense Trend Chart */}
        <div className="col-lg-6">
          <div className="card dark-theme-card shadow-sm h-100">
            <div className="card-header">
              <h4 className="card-title text-dark-main mb-0 text-center">Income vs Expense Trend</h4>
            </div>
            <div className="card-body d-flex justify-content-center align-items-center">
              {monthlyData.labels.length > 0 ? (
                <div style={{ maxHeight: '350px', maxWidth: '100%', margin: 'auto' }}>
                  <Bar data={barChartData} options={barChartOptions} />
                </div>
              ) : (
                <p className="text-center text-dark-muted">No income or expense data to show trend.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Key Monthly Insights Section */}
      <div className="card dark-theme-card shadow-sm p-4">
        <div className="card-body">
          <h4 className="card-title text-dark-main mb-3">Key Monthly Insights</h4>
          <p className="text-dark-muted">
            This section can display more detailed textual summaries, such as:
            <ul>
              <li>Your highest spending category this month was **{Object.keys(expenseCategories).length > 0 ? Object.keys(expenseCategories).reduce((a, b) => expenseCategories[a] > expenseCategories[b] ? a : b) : 'N/A'}**.</li>
              <li>Your total income for the selected period is **${monthlyData.incomes.reduce((sum, val) => sum + val, 0).toFixed(2)}**.</li>
              <li>Your total expenses for the selected period are **${monthlyData.expenses.reduce((sum, val) => sum + val, 0).toFixed(2)}**.</li>
              <li>Net savings/loss for the period: **${(monthlyData.incomes.reduce((sum, val) => sum + val, 0) - monthlyData.expenses.reduce((sum, val) => sum + val, 0)).toFixed(2)}**.</li>
            </ul>
          </p>
        </div>
      </div>
    </div>
  );
};

export default MonthlyTracking;
