import React, { useState } from 'react';
import { api } from '../api';

export default function ViewHistory({ role }) {
  const [landId, setLandId] = useState('');
  const [history, setHistory] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!landId.trim()) return;
    setError('');
    setHistory(null);
    setLoading(true);
    try {
      const res = await api.get(`/getHistory/${landId.trim()}`, role);
      setHistory(res.data.history);
    } catch (err) {
      setError(err.response?.data?.error || 'No history found');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <h2>Ownership History</h2>
        <p>Trace the full ownership timeline of a land parcel</p>
      </div>

      <form onSubmit={handleSearch} className="search-bar">
        <input
          value={landId}
          onChange={(e) => setLandId(e.target.value)}
          placeholder="Enter Land ID (e.g. LAND-001)"
          required
        />
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Loading...' : '📜 Get History'}
        </button>
      </form>

      {error && <div className="alert alert-error">❌ {error}</div>}

      {history && (
        <div className="timeline">
          {history.map((entry, i) => (
            <div className="timeline-item" key={i}>
              <span className={`timeline-type ${entry.type === 'CREATE_LAND' ? 'create' : 'transfer'}`}>
                {entry.type === 'CREATE_LAND' ? '🏗️ Created' : '🔄 Transferred'}
              </span>

              <dl className="key-value" style={{ marginTop: 8 }}>
                <dt>Block #</dt>
                <dd>{entry.blockIndex}</dd>
                <dt>Timestamp</dt>
                <dd>{new Date(entry.timestamp).toLocaleString()}</dd>
                {entry.details.owner && (
                  <>
                    <dt>Owner</dt>
                    <dd><strong>{entry.details.owner}</strong></dd>
                  </>
                )}
                {entry.details.previousOwner && (
                  <>
                    <dt>From</dt>
                    <dd>{entry.details.previousOwner}</dd>
                    <dt>To</dt>
                    <dd><strong>{entry.details.newOwner}</strong></dd>
                  </>
                )}
                {entry.details.location && (
                  <>
                    <dt>Location</dt>
                    <dd>{entry.details.location}</dd>
                  </>
                )}
                <dt>Hash</dt>
                <dd><span className="hash-display">{entry.hash}</span></dd>
              </dl>
            </div>
          ))}
        </div>
      )}

      {!history && !error && !loading && (
        <div className="empty-state">
          <div className="empty-icon">📜</div>
          <p>Enter a Land ID above to view its ownership history</p>
        </div>
      )}
    </div>
  );
}
