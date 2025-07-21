// F:\IncomeSense\client\src\pages\BudgetPlanning.tsx
import React, { useState } from 'react';
// For future enhancements, if needed

const BudgetPlanning: React.FC = () => {
  // State for input fields
  const [netIncome, setNetIncome] = useState<number | ''>('');
  const [budgetRule, setBudgetRule] = useState<string>('50/30/20'); // Default to 50/30/20 rule
  const [preferredLifestyle, setPreferredLifestyle] = useState<string>(''); // Text input, for future personalized advice

  // State for calculated outputs
  const [recommendedSpending, setRecommendedSpending] = useState<number | null>(null);
  const [recommendedSavingsInvestment, setRecommendedSavingsInvestment] = useState<number | null>(null);
  const [calculationError, setCalculationError] = useState<string | null>(null);

  const handleCalculateBudget = (e: React.FormEvent) => {
    e.preventDefault();
    setCalculationError(null); // Clear previous errors

    if (netIncome === '' || isNaN(Number(netIncome)) || Number(netIncome) <= 0) {
      setCalculationError('Please enter a valid positive net income.');
      setRecommendedSpending(null);
      setRecommendedSavingsInvestment(null);
      return;
    }

    const income = Number(netIncome);
    let needsPercentage: number;
    let wantsPercentage: number;
    let savingsInvestmentPercentage: number;

    // Based on the selected budget rule
    switch (budgetRule) {
      case '50/30/20':
        needsPercentage = 0.50; // 50% for Needs (essential expenses)
        wantsPercentage = 0.30; // 30% for Wants (discretionary spending)
        savingsInvestmentPercentage = 0.20; // 20% for Savings & Debt Repayment/Investment
        break;
      // You can add more rules here (e.g., '70/20/10', 'Custom')
      // For 'Custom', you'd need additional input fields for percentages
      default:
        needsPercentage = 0.50;
        wantsPercentage = 0.30;
        savingsInvestmentPercentage = 0.20;
        break;
    }

    const calculatedNeeds = income * needsPercentage;
    const calculatedWants = income * wantsPercentage;
    const calculatedSavingsInvestment = income * savingsInvestmentPercentage;

    setRecommendedSpending(calculatedNeeds + calculatedWants); // Expensed = Needs + Wants
    setRecommendedSavingsInvestment(calculatedSavingsInvestment);
  };

  // Removed useEffect for fetching dummy budgets as this is now a calculator

  return (
    <div className="container-fluid py-4">
      <h1 className="mb-4 text-dark-main fw-bold border-bottom pb-3">
        Budget Allocation Planner
      </h1>

      {calculationError && <div className="alert alert-dark-danger text-sm mb-4" role="alert">{calculationError}</div>}

      {/* Budget Calculation Form */}
      <div className="card dark-theme-card shadow-sm p-4 mb-4">
        <div className="card-body">
          <h4 className="card-title text-dark-main mb-3">Calculate Your Budget Allocation</h4>
          <p className="text-dark-muted mb-4">
            Enter your monthly net income and select a budget rule to get recommendations for spending and savings.
          </p>
          <form onSubmit={handleCalculateBudget} className="row g-3">
              <div className="col-md-6">
                  <label htmlFor="netIncome" className="form-label">Monthly Net Income ($):</label>
                  <input
                    type="number"
                    id="netIncome"
                    placeholder="e.g., 3500"
                    className="form-control form-control-dark"
                    value={netIncome}
                    onChange={(e) => setNetIncome(e.target.value === '' ? '' : parseFloat(e.target.value))}
                    min="0"
                    step="0.01"
                    required
                  />
              </div>
              <div className="col-md-6">
                  <label htmlFor="budgetRule" className="form-label">Budget Rule:</label>
                  <select
                    id="budgetRule"
                    className="form-select form-control-dark"
                    value={budgetRule}
                    onChange={(e) => setBudgetRule(e.target.value)}
                  >
                    <option value="50/30/20">50/30/20 Rule (Needs/Wants/Savings)</option>
                    {/* Add more budget rules here if desired */}
                  </select>
              </div>
              <div className="col-12">
                  <label htmlFor="preferredLifestyle" className="form-label">Preferred Lifestyle (Optional, for future advice):</label>
                  <input
                    type="text"
                    id="preferredLifestyle"
                    placeholder="e.g., Frugal, Moderate, Luxurious"
                    className="form-control form-control-dark"
                    value={preferredLifestyle}
                    onChange={(e) => setPreferredLifestyle(e.target.value)}
                  />
              </div>
              <div className="col-12">
                  <button type="submit" className="btn btn-dark-primary">
                      Calculate Allocation
                  </button>
              </div>
          </form>
        </div>
      </div>

      {/* Budget Allocation Results */}
      {recommendedSpending !== null && recommendedSavingsInvestment !== null && (
        <div className="card dark-theme-card shadow-sm p-4">
          <div className="card-body">
            <h4 className="card-title text-dark-main mb-3">Your Recommended Monthly Allocation</h4>
            <div className="row g-3">
              <div className="col-md-6">
                <div className="card h-100 dark-theme-card shadow-sm">
                  <div className="card-body bg-success-subtle">
                    <h5 className="card-title text-success mb-2">Recommended Spending</h5>
                    <p className="card-text fs-3 fw-bold text-success">${recommendedSpending.toFixed(2)}</p>
                    <p className="text-sm text-dark-muted">(Covers your Needs and Wants)</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card h-100 dark-theme-card shadow-sm">
                  <div className="card-body bg-info-subtle">
                    <h5 className="card-title text-info mb-2">Recommended Savings/Investments</h5>
                    <p className="card-text fs-3 fw-bold text-info">${recommendedSavingsInvestment.toFixed(2)}</p>
                    <p className="text-sm text-dark-muted">(For your financial goals)</p>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-dark-muted mt-4">
              Based on the **{budgetRule} Rule** and your net income of **${Number(netIncome).toFixed(2)}**.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetPlanning;
