// client/src/hooks/useAuth.ts
import { useContext } from 'react';
// --- CORRECTED IMPORTS BELOW ---
// Import the AuthContext value
import { AuthContext } from '../auth/authContextDefinition';
// Import AuthContextType type explicitly using 'import type'
import type { AuthContextType } from '../auth/authContextDefinition';
// --- CORRECTED IMPORTS ABOVE ---

// Custom hook to use the AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};