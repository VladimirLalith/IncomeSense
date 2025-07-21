// F:\IncomeSense\client\src\pages\Register.tsx
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

const Register: React.FC = () => {
  const { register, error, loading } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await register(username, email, password); // Adjust if your hook uses firstName/lastName
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
            Create new account.
          </h2>
          <p className="text-center text-bronx-muted mb-4">
            Already a Member?{' '}
            <Link to="/login" className="text-bronx-red fw-bold" style={{ cursor: 'pointer' }}>
              Log In
            </Link>
          </p>

          {error && (
            <div className="alert alert-bronx-danger text-sm mb-4" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label htmlFor="regFirstName" className="form-label visually-hidden">First Name:</label>
                <input
                  type="text"
                  id="regFirstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="form-control form-control-lg form-control-bronx" // Changed class
                  placeholder="First Name"
                  required
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="regLastName" className="form-label visually-hidden">Last Name:</label>
                <input
                  type="text"
                  id="regLastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="form-control form-control-lg form-control-bronx" // Changed class
                  placeholder="Last Name"
                  required
                />
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="regUsername" className="form-label visually-hidden">Email:</label>
              <input
                type="text"
                id="regUsername"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="form-control form-control-lg form-control-bronx" // Changed class
                placeholder="Username"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="regEmail" className="form-label visually-hidden">Email:</label>
              <input
                type="email"
                id="regEmail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control form-control-lg form-control-bronx" // Changed class
                placeholder="Email"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="regPassword" className="form-label visually-hidden">Password:</label>
              <input
                type="password"
                id="regPassword"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control form-control-lg form-control-bronx" // Changed class
                placeholder="Password"
                required
              />
            </div>
            <div className="d-flex justify-content-between gap-3">
              <button
                type="button"
                className="btn btn-bronx-secondary btn-lg flex-grow-1" // Changed class
              >
                Change method
              </button>
              <button
                type="submit"
                className="btn btn-bronx-primary btn-lg flex-grow-1" // Changed class
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create account'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
