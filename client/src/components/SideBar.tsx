// F:\IncomeSense\client\src\components\Sidebar.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col min-h-screen p-4 shadow-lg sticky top-0">
      <div className="text-3xl font-extrabold text-center mb-10 text-blue-400">
        IncomeSense
      </div>
      <nav className="flex-grow">
        <ul>
          <li className="mb-3">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center p-3 rounded-lg transition-colors duration-200 ` +
                (isActive
                  ? `bg-blue-700 text-white shadow-md transform scale-105`
                  : `hover:bg-gray-700 text-gray-300`)
              }
            >
              <i className="fas fa-chart-line mr-3 text-lg"></i> Overview
            </NavLink>
          </li>
          <li className="mb-3">
            <NavLink
              to="/budget"
              className={({ isActive }) =>
                `flex items-center p-3 rounded-lg transition-colors duration-200 ` +
                (isActive
                  ? `bg-blue-700 text-white shadow-md transform scale-105`
                  : `hover:bg-gray-700 text-gray-300`)
              }
            >
              <i className="fas fa-wallet mr-3 text-lg"></i> Budget Planning
            </NavLink>
          </li>
          <li className="mb-3">
            <NavLink
              to="/tracking"
              className={({ isActive }) =>
                `flex items-center p-3 rounded-lg transition-colors duration-200 ` +
                (isActive
                  ? `bg-blue-700 text-white shadow-md transform scale-105`
                  : `hover:bg-gray-700 text-gray-300`)
              }
            >
              <i className="fas fa-chart-pie mr-3 text-lg"></i> Monthly Tracking
            </NavLink>
          </li>
          {/* Add more navigation links here for future sections */}
        </ul>
      </nav>
      <div className="mt-auto pt-6 border-t border-gray-700">
        {user && (
          <p className="text-gray-400 text-sm mb-3 text-center">
            Logged in as: <span className="font-semibold text-blue-200">{user.username}</span>
          </p>
        )}
        <button
          onClick={logout}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-4 rounded-lg transition duration-200 ease-in-out focus:outline-none focus:shadow-outline transform hover:scale-105"
        >
          <i className="fas fa-sign-out-alt mr-2"></i> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;