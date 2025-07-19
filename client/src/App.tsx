// client/src/App.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Register from './pages/Register.tsx';
import Login from './pages/Login.tsx';
import Dashboard from './pages/DashBoard.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx'; // Import ProtectedRoute
import './App.css'; // Your main CSS

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} /> {/* Default route */}

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Add more protected routes here, e.g., <Route path="/budget-plans" element={<BudgetPlans />} /> */}
        </Route>
      </Routes>
    </div>
  );
}

export default App;