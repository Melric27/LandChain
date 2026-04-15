import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CreateLand from './pages/CreateLand';
import TransferLand from './pages/TransferLand';
import ViewLand from './pages/ViewLand';
import ViewHistory from './pages/ViewHistory';
import ViewChain from './pages/ViewChain';

const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: '📊' },
  { path: '/create', label: 'Register Land', icon: '📝' },
  { path: '/transfer', label: 'Transfer Land', icon: '🔄' },
  { path: '/view', label: 'View Land', icon: '🔍' },
  { path: '/history', label: 'View History', icon: '📜' },
  { path: '/chain', label: 'Blockchain', icon: '⛓️' },
];

function App() {
  const [role, setRole] = useState('admin');

  return (
    <Router>
      <div className="app-wrapper">
        {/* ── Sidebar ── */}
        <aside className="sidebar">
          <div className="sidebar-brand">
            <h1>⛓️ LandChain</h1>
            <p>Permissioned Blockchain</p>
          </div>

          <nav className="sidebar-nav">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Role Selector */}
          <div className="role-selector">
            <label>Active Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="admin">🔑 Admin</option>
              <option value="user">👤 User (View-Only)</option>
            </select>
            <span className={`role-badge ${role}`}>
              {role === 'admin' ? '🔑 Admin' : '👤 User'}
            </span>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard role={role} />} />
            <Route path="/create" element={<CreateLand role={role} />} />
            <Route path="/transfer" element={<TransferLand role={role} />} />
            <Route path="/view" element={<ViewLand role={role} />} />
            <Route path="/history" element={<ViewHistory role={role} />} />
            <Route path="/chain" element={<ViewChain role={role} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
