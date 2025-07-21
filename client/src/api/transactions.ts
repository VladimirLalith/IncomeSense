// client/src/api/transactions.ts
import axios from 'axios';
import type { User } from '../auth/authContextDefinition'; // Import User interface as a type (corrected path to auth)

// Define your backend API URL for transactions
const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/transactions`;

// Define interfaces for transaction data
export interface TransactionData {
  _id?: string; // Optional for new transactions, present for existing ones
  type: 'income' | 'expense';
  category: string;
  amount: number;
  date: string; // Will send/receive as ISO string
  description?: string;
  createdAt?: string; // Optional, set by backend
  updatedAt?: string; // Optional, set by backend
  user?: string; // User ID string, optional for frontend logic but returned by backend
}

// Helper function to get authorized Axios instance
const getAuthAxios = () => {
  const userString = localStorage.getItem('user');
  if (!userString) {
    throw new Error('User not authenticated. No token found.');
  }
  const user: User = JSON.parse(userString); // User is used as a type here
  if (!user.token) {
    throw new Error('User token is missing.');
  }

  return axios.create({
    baseURL: API_URL,
    headers: {
      Authorization: `Bearer ${user.token}`,
      'Content-Type': 'application/json',
    },
  });
};

// @desc    Get all transactions for the authenticated user
export const getTransactions = async (): Promise<TransactionData[]> => {
  const api = getAuthAxios();
  const response = await api.get<TransactionData[]>('/');
  return response.data;
};

// @desc    Add a new transaction
export const addTransaction = async (transaction: Omit<TransactionData, '_id' | 'createdAt' | 'updatedAt' | 'user'>): Promise<TransactionData> => {
  const api = getAuthAxios();
  const response = await api.post<TransactionData>('/', transaction);
  return response.data;
};

// @desc    Update an existing transaction
export const updateTransaction = async (id: string, transaction: Partial<Omit<TransactionData, '_id' | 'createdAt' | 'updatedAt' | 'user'>>): Promise<TransactionData> => {
  const api = getAuthAxios();
  const response = await api.put<TransactionData>(`/${id}`, transaction);
  return response.data;
};

// @desc    Delete a transaction
export const deleteTransaction = async (id: string): Promise<{ message: string }> => {
  const api = getAuthAxios();
  const response = await api.delete<{ message: string }>(`/${id}`);
  return response.data;
};