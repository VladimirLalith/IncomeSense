// client/src/context/authContextDefinition.ts
import { createContext } from 'react';

// Define the shape of a user object
// This is its definitive place now.
export interface User {
  _id: string;
  username: string;
  email: string;
  token: string;
}

// Define the shape of the AuthContext value
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Create the context with a default undefined value
export const AuthContext = createContext<AuthContextType | undefined>(undefined);