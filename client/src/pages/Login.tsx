// F:\IncomeSense\client\src\pages\Login.tsx
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

const Login: React.FC = () => {
  const { login, error, loading } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(username, password);
  };

  return (
    <div className="auth-page-background">
      {/* Top Left Header */}
      <div className="auth-header">
        <span className="dot"></span> IncomeSense
      </div>

      <div className="card shadow-lg p-4 p-md-5 auth-card">
        <div className="card-body">
          <h2 className="auth-title text-center text-bronx-main mb-4">
            Welcome Back!
          </h2>

          {error && (
            <div className="alert alert-bronx-danger text-sm mb-4" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="loginUsername" className="form-label">
                Username:
              </label>
              <input
                type="text"
                id="loginUsername"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="form-control form-control-lg form-control-bronx" // Changed class
                placeholder="Enter your username"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="loginPassword" className="form-label">
                Password:
              </label>
              <input
                type="password"
                id="loginPassword"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control form-control-lg form-control-bronx" // Changed class
                placeholder="Enter your password"
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-bronx-primary btn-lg w-100" // Changed class
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Login'}
            </button>
          </form>
          <p className="text-center text-bronx-muted mt-4">
            Don't have an account?{' '}
            <Link to="/register" className="text-bronx-red fw-bold" style={{ cursor: 'pointer' }}>
              Register now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
