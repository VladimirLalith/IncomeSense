// F:\IncomeSense\client\src\App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { AuthProvider } from './auth/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/DashBoard';
import Sidebar from './components/SideBar';
import BudgetPlanning from './pages/BudgetPlanning';
import MonthlyTracking from './pages/MonthlyTracking';

// A protected route component to ensure user is logged in
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-dark"> {/* Changed bg-light to bg-dark */}
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="ms-3 text-white">Loading application...</p> {/* Changed text-muted to text-white */}
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="d-flex min-vh-100 bg-dark"> {/* Changed bg-light to bg-dark */}
      <Sidebar /> {/* Your Sidebar component */}
      <main className="flex-grow-1 p-4 overflow-auto dashboard-background"> {/* dashboard-background will handle its own image */}
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
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Navigate to="/login" replace />} /> {/* Redirect root to login */}

          {/* Protected Routes */}
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

          {/* Catch-all for undefined routes (redirect to login or a 404 page) */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
