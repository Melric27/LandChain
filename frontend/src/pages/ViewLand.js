import React, { useState } from 'react';
import { api } from '../api';

export default function ViewLand({ role }) {
  const [landId, setLandId] = useState('');
  const [land, setLand] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!landId.trim()) return;
    setError('');
    setLand(null);
    setLoading(true);
    try {
      const res = await api.get(`/getLand/${landId.trim()}`, role);
      setLand(res.data.land);
    } catch (err) {
      setError(err.response?.data?.error || 'Land not found');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <h2>View Land Details</h2>
        <p>Look up a registered land parcel by its ID</p>
      </div>

      <form onSubmit={handleSearch} className="search-bar">
        <input
          value={landId}
          onChange={(e) => setLandId(e.target.value)}
          placeholder="Enter Land ID (e.g. LAND-001)"
          required
        />
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Searching...' : '🔍 Search'}
        </button>
      </form>

      {error && <div className="alert alert-error">❌ {error}</div>}

      {land && (
        <div className="card" style={{ maxWidth: 640 }}>
          <div className="card-header">
            <h3 className="card-title">🏠 {land.landId}</h3>
          </div>
          <dl className="key-value">
            <dt>Owner</dt>
            <dd><strong>{land.owner}</strong></dd>
            <dt>Location</dt>
            <dd>{land.location}</dd>
            <dt>Area</dt>
            <dd>{Number(land.area).toLocaleString()} sq ft</dd>
            <dt>Price</dt>
            <dd>₹{Number(land.price).toLocaleString()}</dd>
            <dt>Created</dt>
            <dd>{new Date(land.createdAt).toLocaleString()}</dd>
            {land.lastTransferredAt && (
              <>
                <dt>Last Transfer</dt>
                <dd>{new Date(land.lastTransferredAt).toLocaleString()}</dd>
              </>
            )}
          </dl>
        </div>
      )}

      {!land && !error && !loading && (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <p>Enter a Land ID above to view its details</p>
        </div>
      )}
    </div>
  );
}
