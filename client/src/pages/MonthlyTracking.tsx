// F:\IncomeSense\client\src\pages\MonthlyTracking.tsx
import React, { useState, useEffect } from 'react';
// If you install Chart.js, uncomment these imports:
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
// import { Pie } from 'react-chartjs-2';

// ChartJS.register(ArcElement, Tooltip, Legend); // Uncomment if using Chart.js

const MonthlyTracking: React.FC = () => {
  interface ChartData {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string[];
      borderColor: string[];
      borderWidth: number;
    }[];
  }
  
  const [data, setData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMonthlyData = async () => {
      setLoading(true);
      setError(null);
      try {
        // You'll need an API to fetch aggregated monthly data from your backend
        // For now, using dummy data based on common categories
        const dummyTransactions = [
          { category: 'Food & Groceries', amount: 300, type: 'expense' },
          { category: 'Salary', amount: 2000, type: 'income' },
          { category: 'Transportation', amount: 100, type: 'expense' },
          { category: 'Entertainment', amount: 150, type: 'expense' },
          { category: 'Freelance Income', amount: 500, type: 'income' },
          { category: 'Rent', amount: 800, type: 'expense' },
          { category: 'Utilities', amount: 75, type: 'expense' },
          { category: 'Shopping', amount: 200, type: 'expense' },
          { category: 'Investments', amount: 1000, type: 'expense' },
        ];

        const expenseCategories = dummyTransactions
          .filter(t => t.type === 'expense')
          .reduce((acc: { [key: string]: number }, t) => {
            acc[t.category] = (acc[t.category] || 0) + t.amount;
            return acc;
          }, {});

        const expenseLabels = Object.keys(expenseCategories);
        const expenseAmounts = Object.values(expenseCategories);

        setData({
          labels: expenseLabels,
          datasets: [
            {
              label: 'Amount ($)',
              data: expenseAmounts,
              backgroundColor: [
                'rgba(255, 99, 132, 0.7)', // Red
                'rgba(54, 162, 235, 0.7)', // Blue
                'rgba(255, 206, 86, 0.7)', // Yellow
                'rgba(75, 192, 192, 0.7)', // Green
                'rgba(153, 102, 255, 0.7)',// Purple
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
        });

      } catch (err: unknown) {
        setError("Failed to fetch tracking data.");
        console.error("Error fetching tracking data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMonthlyData();
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md min-h-full">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6 border-b pb-4">
        Monthly Tracking & Analytics
      </h1>

      {loading && <p className="text-center text-gray-600">Loading analytics...</p>}
      {error && <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-sm">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-blue-50 p-6 rounded-lg shadow-sm border border-blue-200">
          <h2 className="text-xl font-semibold text-blue-800 mb-4">Expense Categories Breakdown</h2>
          {data ? (
            // Uncomment the <Pie> component and install Chart.js to see the chart
            // <div style={{ maxHeight: '400px', maxWidth: '400px', margin: 'auto' }}>
            //   <Pie data={data} />
            // </div>
            <p className="text-center text-gray-600">Install `react-chartjs-2` and `chart.js` to see the chart here!</p>
          ) : (
            <p className="text-center text-gray-600">No expense data to display for this month.</p>
          )}
        </div>
        <div className="bg-green-50 p-6 rounded-lg shadow-sm border border-green-200">
          <h2 className="text-xl font-semibold text-green-800 mb-4">Income vs Expense Trend</h2>
          <p className="text-center text-gray-600">A bar chart or line chart showing income and expense trends over months will go here.</p>
          {/* You would integrate another chart component here */}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Key Monthly Insights</h2>
        <p className="text-gray-700">This section can display text summaries, top spending categories, savings rate, etc.</p>
        {/* Further textual summaries or tables can go here */}
      </div>
    </div>
  );
};

export default MonthlyTracking;