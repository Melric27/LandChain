import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';

export default function Dashboard({ role }) {
  const [stats, setStats] = useState({ lands: 0, blocks: 0, valid: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [landsRes, chainRes, validateRes] = await Promise.all([
          api.get('/lands', role),
          api.get('/chain', role),
          api.get('/validate', role),
        ]);
        setStats({
          lands: landsRes.data.count,
          blocks: chainRes.data.length,
          valid: validateRes.data.valid,
        });
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, [role]);

  return (
    <div className="fade-in">
      <div className="page-header">
        <h2>Dashboard</h2>
        <p>Overview of the LandChain permissioned blockchain system</p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon green">🏠</div>
          <div>
            <div className="stat-value">{loading ? '—' : stats.lands}</div>
            <div className="stat-label">Registered Lands</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue">⛓️</div>
          <div>
            <div className="stat-value">{loading ? '—' : stats.blocks}</div>
            <div className="stat-label">Blocks on Chain</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple">✅</div>
          <div>
            <div className="stat-value">
              {loading ? '—' : stats.valid ? 'Valid' : 'Invalid'}
            </div>
            <div className="stat-label">Chain Integrity</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon amber">🔑</div>
          <div>
            <div className="stat-value" style={{ textTransform: 'capitalize' }}>
              {role}
            </div>
            <div className="stat-label">Current Role</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Quick Actions</h3>
        </div>
        <div className="quick-actions">
          <Link to="/create" className="action-card">
            <span className="action-icon">📝</span>
            <span className="action-label">Register Land</span>
            <span className="action-desc">Add a new land to the ledger</span>
          </Link>
          <Link to="/transfer" className="action-card">
            <span className="action-icon">🔄</span>
            <span className="action-label">Transfer Land</span>
            <span className="action-desc">Change ownership of land</span>
          </Link>
          <Link to="/view" className="action-card">
            <span className="action-icon">🔍</span>
            <span className="action-label">View Land</span>
            <span className="action-desc">Look up land by ID</span>
          </Link>
          <Link to="/chain" className="action-card">
            <span className="action-icon">⛓️</span>
            <span className="action-label">View Chain</span>
            <span className="action-desc">Explore the blockchain</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
