import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CreateLand from './pages/CreateLand';
import TransferLand from './pages/TransferLand';
import ViewLand from './pages/ViewLand';
import ViewHistory from './pages/ViewHistory';
import ViewChain from './pages/ViewChain';
import SuspiciousTransactions from './pages/SuspiciousTransactions';

const NAV_ITEMS = [
  { path: '/', label: 'Ledger', icon: 'book_5' },
  { path: '/create', label: 'Register', icon: 'account_balance' },
  { path: '/transfer', label: 'Transfers', icon: 'monitoring' },
  { path: '/view', label: 'Lookup', icon: 'inventory_2' },
  { path: '/history', label: 'History', icon: 'history_edu' },
  { path: '/chain', label: 'Blockchain', icon: 'database' },
  { path: '/suspicious', label: 'Fraud Alerts', icon: 'gpp_maybe', adminOnly: true },
];

function App() {
  const [role, setRole] = useState('admin');

  return (
    <Router>
      <div className="flex bg-[#fcf9f4] dark:bg-[#1c1c19] text-[#1c1c19] dark:text-[#fcf9f4] min-h-screen">
        {/* ── Sidebar ── */}
        <nav className="fixed left-0 top-0 h-full flex flex-col py-8 px-6 bg-[#fcf9f4] dark:bg-[#1c1c19] w-64 border-r border-[#f6f3ee]/10 z-50">
          <div className="mb-12">
            <h1 className="text-2xl font-headline font-serif text-[#00322d] dark:text-[#fcf9f4]">The Modern Archive</h1>
            <p className="font-headline tracking-tight text-xs uppercase opacity-60 mt-1">Registry Ledger</p>
          </div>

          <div className="flex-1 space-y-2">
            {NAV_ITEMS.filter(item => {
              if (item.path === '/chain' && role !== 'admin') return false;
              if (item.adminOnly && role !== 'admin') return false;
              return true;
            }).map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-4 py-3 pl-4 transition-all font-semibold ` +
                  (isActive
                    ? 'text-[#00322d] dark:text-[#fcf9f4] border-l-2 border-[#00322d]'
                    : 'text-[#595f66] dark:text-[#ebe8e3] hover:text-[#00322d] hover:bg-[#f6f3ee] dark:hover:bg-[#312b25]')
                }
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span className="font-headline tracking-tight">{item.label}</span>
              </NavLink>
            ))}
          </div>

          <div className="pt-8 border-t border-outline-variant/20 space-y-4">
            <button
              onClick={() => setRole(role === 'admin' ? 'user' : 'admin')}
              className="w-full py-2 text-sm font-label font-medium bg-primary text-on-primary rounded-lg transition-transform duration-200 ease-in-out hover:opacity-90 active:scale-95"
            >
              Switch Role ({role === 'admin' ? 'Admin' : 'User'})
            </button>
            <div className="flex flex-col gap-2">
              <a href="#" className="flex items-center gap-4 py-2 text-xs text-[#595f66] font-headline tracking-tight hover:text-[#00322d] transition-colors">
                <span className="material-symbols-outlined text-lg">help_outline</span> Support
              </a>
              <a href="#" className="flex items-center gap-4 py-2 text-xs text-[#595f66] font-headline tracking-tight hover:text-[#00322d] transition-colors">
                <span className="material-symbols-outlined text-lg">logout</span> Logout
              </a>
            </div>
          </div>
        </nav>

        {/* ── Main Canvas ── */}
        <div className="flex-1 ml-64 flex flex-col min-h-screen relative">
          {/* TopAppBar Shell */}
          <header className="sticky top-0 z-40 bg-[#fcf9f4]/80 dark:bg-[#1c1c19]/80 backdrop-blur-md shadow-[0px_20px_40px_rgba(28,28,25,0.06)] flex justify-between items-center w-full px-8 py-4">
            <div className="flex items-center gap-8">
              <span className="font-serif text-xl italic text-[#00322d] dark:text-[#fcf9f4]">Land Registry</span>
              <div className="hidden md:flex gap-6 items-center">
                <span className="font-['Inter'] text-sm tracking-wide uppercase font-medium text-[#595f66] hover:text-[#00322d] transition-colors cursor-pointer">Provenance</span>
                <span className="font-['Inter'] text-sm tracking-wide uppercase font-medium text-[#595f66] hover:text-[#00322d] transition-colors cursor-pointer">Transfers</span>
                <span className="font-['Inter'] text-sm tracking-wide uppercase font-medium text-[#595f66] hover:text-[#00322d] transition-colors cursor-pointer">Legal</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex gap-2 mr-4">
                <button className="p-2 text-secondary hover:text-primary transition-colors">
                  <span className="material-symbols-outlined">notifications</span>
                </button>
                <button className="p-2 text-secondary hover:text-primary transition-colors">
                  <span className="material-symbols-outlined">history</span>
                </button>
              </div>
              <span className="px-4 py-2 bg-surface-container-highest text-primary font-label text-xs uppercase tracking-widest rounded-lg">
                Role: {role.toUpperCase()}
              </span>
            </div>
          </header>

          {/* Router Content */}
          <main className="p-12 flex-1">
            <Routes>
              <Route path="/" element={<Dashboard role={role} />} />
              <Route path="/create" element={<CreateLand role={role} />} />
              <Route path="/transfer" element={<TransferLand role={role} />} />
              <Route path="/view" element={<ViewLand role={role} />} />
              <Route path="/history" element={<ViewHistory role={role} />} />
              <Route path="/chain" element={<ViewChain role={role} />} />
              <Route path="/suspicious" element={<SuspiciousTransactions role={role} />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
