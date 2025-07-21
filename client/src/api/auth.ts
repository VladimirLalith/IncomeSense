/* eslint-disable @typescript-eslint/no-explicit-any */
// client/src/api/auth.ts
import axios from 'axios';

// Define your backend API URL
//for deploypush
const API_URL = import.meta.env.VITE_API_BASE_URL; // Make sure this matches your backend

interface AuthResponse {
  _id: string;
  username: string;
  email: string;
  token: string;
}

export const registerUser = async (username: string, email: string, password: string): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(`${API_URL}/api/auth/register`, { username, email, password });
  return response.data;
};

export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(`${API_URL}/api/auth/login`, { email, password });
  return response.data;
};


export const getTransactions = async () => {
  const response = await axios.get(`${API_URL}/api/transactions`);
  return response.data;
};

export const addTransaction = async (data: any) => {
  const response = await axios.post(`${API_URL}/api/transactions`, data);
  return response.data;
};