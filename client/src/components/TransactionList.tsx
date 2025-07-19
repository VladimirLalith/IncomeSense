// client/src/components/TransactionList.tsx
import React from 'react';
// --- CORRECTED IMPORT BELOW ---
import type { TransactionData } from '../api/transactions'; // TransactionData is a type, must use 'import type'
// --- CORRECTED IMPORT ABOVE ---

interface TransactionListProps {
  transactions: TransactionData[];
  onEdit: (transaction: TransactionData) => void;
  onDelete: (id: string) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, onEdit, onDelete }) => {
  return (
    <div style={{ marginBottom: '30px' }}>
      <h3>Transaction History</h3>
      {transactions.length === 0 ? (
        <p>No transactions yet for this period. Add your first income or expense!</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={tableHeaderStyle}>Type</th>
              <th style={tableHeaderStyle}>Category</th>
              <th style={tableHeaderStyle}>Amount</th>
              <th style={tableHeaderStyle}>Date</th>
              <th style={tableHeaderStyle}>Description</th>
              <th style={tableHeaderStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction._id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={tableCellStyle}>{transaction.type === 'income' ? 'Income' : 'Expense'}</td>
                <td style={tableCellStyle}>{transaction.category}</td>
                <td style={{ ...tableCellStyle, color: transaction.type === 'income' ? 'green' : 'red' }}>
                  {transaction.type === 'expense' ? '-' : ''}${transaction.amount.toFixed(2)}
                </td>
                <td style={tableCellStyle}>{new Date(transaction.date).toLocaleDateString()}</td>
                <td style={tableCellStyle}>{transaction.description || '-'}</td>
                <td style={tableCellStyle}>
                  <button onClick={() => onEdit(transaction)} style={{ padding: '5px 10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '5px' }}>Edit</button>
                  <button onClick={() => onDelete(transaction._id!)} style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

// Simple inline styles for table
const tableHeaderStyle: React.CSSProperties = {
  padding: '10px',
  textAlign: 'left',
  borderBottom: '1px solid #ddd',
};

const tableCellStyle: React.CSSProperties = {
  padding: '10px',
  borderBottom: '1px solid #eee',
};

export default TransactionList;