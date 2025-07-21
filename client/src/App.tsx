// F:\IncomeSense\client\src\App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { AuthProvider } from './auth/AuthProvider';
import Auth from './pages/Login';
import Dashboard from './pages/DashBoard';
import Sidebar from './components/SideBar'; // Import the Sidebar component
// Import new pages
import BudgetPlanning from './pages/BudgetPlanning';
import MonthlyTracking from './pages/MonthlyTracking';

// A simple protected route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-700 text-xl">Loading application...</p>
      </div>
    ); // Or a proper spinner
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="flex min-h-screen bg-gray-100"> {/* Flex container for sidebar and content */}
      <Sidebar />
      <main className="flex-grow p-6 overflow-auto"> {/* Main content area, flex-grow to fill space */}
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} /> {/* Default redirect */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/budget"
            element={
              <ProtectedRoute>
                <BudgetPlanning />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tracking"
            element={
              <ProtectedRoute>
                <MonthlyTracking />
              </ProtectedRoute>
            }
          />
          {/* Add more protected routes here as you create new sections */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} /> {/* Fallback for unknown routes */}
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;