// F:\IncomeSense\client\src\components\Sidebar.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar: React.FC = () => {
  return (
    <div className="sidebar-custom bg-dark text-white d-flex flex-column p-4"> {/* bg-dark will now map to bronx-black */}
      <div className="text-center mb-5">
        <h3 className="text-white fw-bold">IncomeSense</h3>
        <p className="text-bronx-muted small">Your Financial Companion</p> {/* Changed to bronx-muted */}
      </div>
      <nav className="flex-grow-1">
        <ul className="nav flex-column">
          <li className="nav-item mb-2">
            <NavLink
              to="/dashboard"
              className="nav-link text-white" // text-white will map to bronx-white
              end
            >
              <i className="fas fa-chart-line me-3"></i> Overview
            </NavLink>
          </li>
          <li className="nav-item mb-2">
            <NavLink
              to="/budget"
              className="nav-link text-white"
            >
              <i className="fas fa-wallet me-3"></i> Budget Planning
            </NavLink>
          </li>
          <li className="nav-item mb-2">
            <NavLink
              to="/tracking"
              className="nav-link text-white"
            >
              <i className="fas fa-chart-pie me-3"></i> Monthly Tracking
            </NavLink>
          </li>
          {/* Add more navigation links as needed */}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
