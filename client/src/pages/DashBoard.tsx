// client/src/pages/Dashboard.tsx
import React from 'react';
import { useAuth } from '../hooks/useAuth';
const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h2>Welcome to your IncomeSense Dashboard, {user?.username}!</h2>
      <p>This is where you'll see your financial overview.</p>
      <button onClick={logout} style={{ padding: '10px 20px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
        Logout
      </button>

      {/* Placeholder for future content */}
      <div style={{ marginTop: '30px', borderTop: '1px dashed #eee', paddingTop: '20px' }}>
        <h3>Your Financial Summary (Coming Soon!)</h3>
        <p>You can add your budget plans, track expenses, and view insights here.</p>
      </div>
    </div>
  );
};

export default Dashboard;