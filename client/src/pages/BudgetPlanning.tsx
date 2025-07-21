// F:\IncomeSense\client\src\pages\BudgetPlanning.tsx
import React, { useState, useEffect } from 'react';
// You will likely need to define a BudgetData type and API functions
// import { getBudgets, addBudget, updateBudget, deleteBudget, BudgetData } from '../api/budgets';

const BudgetPlanning: React.FC = () => {
  type BudgetData = {
    id: string;
    category: string;
    limit: number;
    spent: number;
  };
  
  const [budgets, setBudgets] = useState<BudgetData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Example: Fetch budgets (you'll need to create corresponding API endpoints on the backend)
  useEffect(() => {
    const fetchBudgets = async () => {
      setLoading(true);
      setError(null);
      try {
        // const data = await getBudgets(); // Call your backend API
        // setBudgets(data);
        setBudgets([ // Dummy data for now
          { id: '1', category: 'Food', limit: 500, spent: 300 },
          { id: '2', category: 'Rent', limit: 1200, spent: 1200 },
          { id: '3', category: 'Entertainment', limit: 200, spent: 150 },
          { id: '4', category: 'Utilities', limit: 150, spent: 100 },
          { id: '5', category: 'Transportation', limit: 100, spent: 80 },
        ]);
      } catch (err: unknown) {
        // Handle errors similar to Dashboard.tsx
        setError("Failed to fetch budgets.");
        console.error("Error fetching budgets:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBudgets();
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md min-h-full">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6 border-b pb-4">
        Budget Planning
      </h1>

      {loading && <p className="text-center text-gray-600">Loading budgets...</p>}
      {error && <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-sm">{error}</p>}

      {/* Budget Form (to add/edit budget limits) */}
      <div className="mb-8 p-6 bg-gray-50 rounded-lg shadow-inner">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Set Monthly Budget</h2>
        <p className="text-gray-600 mb-4">
          Use this section to set your monthly spending limits for various categories.
        </p>
        {/* Implement a form here for category, limit, etc. */}
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">Category:</label>
                <input type="text" id="category" placeholder="e.g., Groceries" className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700" />
            </div>
            <div>
                <label htmlFor="limit" className="block text-gray-700 text-sm font-bold mb-2">Budget Limit ($):</label>
                <input type="number" id="limit" placeholder="e.g., 300" className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700" />
            </div>
            <div className="md:col-span-2">
                <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg w-full md:w-auto transition duration-200">
                    Add/Update Budget
                </button>
            </div>
        </form>
      </div>

      {/* Budget List/Summary */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Current Budgets</h2>
        {budgets.length === 0 && !loading && !error && (
          <p className="text-center text-gray-600">No budgets set yet. Start by adding one above!</p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {budgets.map(budget => (
            <div key={budget.id} className="bg-blue-50 p-6 rounded-lg shadow-sm border border-blue-200">
              <h3 className="text-xl font-semibold text-blue-800 mb-2">{budget.category}</h3>
              <p className="text-gray-700 text-md">Limit: <span className="font-bold text-blue-900 text-lg">${budget.limit.toFixed(2)}</span></p>
              <p className="text-gray-700 text-md">Spent: <span className="font-bold text-blue-900 text-lg">${budget.spent.toFixed(2)}</span></p>
              <div className="w-full bg-gray-200 rounded-full h-3 mt-3">
                <div
                  className={`h-3 rounded-full ${budget.spent / budget.limit > 1 ? 'bg-red-600' : 'bg-blue-600'}`}
                  style={{ width: `${Math.min(100, (budget.spent / budget.limit) * 100)}%` }}
                ></div>
              </div>
              <p className={`text-sm mt-2 ${budget.spent / budget.limit > 1 ? 'text-red-600 font-semibold' : 'text-gray-500'}`}>
                {budget.spent / budget.limit > 1 ? 'Over budget!' : `Remaining: $${(budget.limit - budget.spent).toFixed(2)}`}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BudgetPlanning;