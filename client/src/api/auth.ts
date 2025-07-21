// client/src/api/auth.ts
import axios from 'axios';

// Define your backend API URL
const API_URL = 'https://incomesense.onrender.com'; // Make sure this matches your backend

interface AuthResponse {
  _id: string;
  username: string;
  email: string;
  token: string;
}

export const registerUser = async (username: string, email: string, password: string): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(`${API_URL}/register`, { username, email, password });
  return response.data;
};

export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(`${API_URL}/login`, { email, password });
  return response.data;
};