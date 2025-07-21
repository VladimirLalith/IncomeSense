// F:\IncomeSense\client\src\components\TransactionList.tsx
import React from 'react';
import type { TransactionData } from '../api/transactions';

interface TransactionListProps {
  transactions: TransactionData[];
  onEdit: (transaction: TransactionData) => void;
  onDelete: (id: string) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, onEdit, onDelete }) => {
  return (
    <div className="card shadow-sm p-4">
      <div className="card-body">
        <h4 className="card-title mb-3">Transaction History</h4>
        {transactions.length === 0 ? (
          <p className="text-center text-muted">No transactions yet for this period. Add your first income or expense!</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-hover transaction-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction._id}>
                    <td>
                      <span className={`badge ${transaction.type === 'income' ? 'bg-success' : 'bg-danger'}`}>
                        {transaction.type === 'income' ? 'Income' : 'Expense'}
                      </span>
                    </td>
                    <td>{transaction.category}</td>
                    <td className={transaction.type === 'income' ? 'text-success fw-bold' : 'text-danger fw-bold'}>
                      {transaction.type === 'expense' ? '-' : ''}${transaction.amount.toFixed(2)}
                    </td>
                    <td>{new Date(transaction.date).toLocaleDateString()}</td>
                    <td>{transaction.description || '-'}</td>
                    <td>
                      <button
                        onClick={() => onEdit(transaction)}
                        className="btn btn-sm btn-info me-2"
                      >
                        <i className="fas fa-edit"></i> Edit
                      </button>
                      <button
                        onClick={() => onDelete(transaction._id!)}
                        className="btn btn-sm btn-danger"
                      >
                        <i className="fas fa-trash-alt"></i> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionList;
