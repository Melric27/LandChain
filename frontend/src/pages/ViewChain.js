import React, { useEffect, useState } from 'react';
import { api } from '../api';

export default function ViewChain({ role }) {
  const [chain, setChain] = useState([]);
  const [validation, setValidation] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [chainRes, valRes] = await Promise.all([
        api.get('/chain', role),
        api.get('/validate', role),
      ]);
      setChain(chainRes.data.chain);
      setValidation(valRes.data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  return (
    <div className="fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2>Blockchain Explorer</h2>
          <p>View all blocks in the LandChain ledger</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {validation && (
            <span className={`validation-badge ${validation.valid ? 'valid' : 'invalid'}`}>
              {validation.valid ? '✅ Chain Valid' : '❌ Chain Invalid'}
            </span>
          )}
          <button onClick={fetchData} className="btn btn-secondary" disabled={loading}>
            🔄 Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="empty-state">
          <div className="spinner" style={{ margin: '0 auto' }}></div>
        </div>
      ) : (
        <div>
          {chain.map((block, i) => (
            <React.Fragment key={block.index}>
              <div className={`block-card ${block.index === 0 ? 'genesis' : ''}`}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 14 }}>
                  <span className="block-index">{block.index}</span>
                  <strong style={{ fontSize: '0.95rem' }}>
                    {block.index === 0
                      ? 'Genesis Block'
                      : block.data.type === 'CREATE_LAND'
                      ? `Land Created — ${block.data.landId}`
                      : `Land Transferred — ${block.data.landId}`}
                  </strong>
                </div>

                <dl className="key-value">
                  <dt>Timestamp</dt>
                  <dd>{new Date(block.timestamp).toLocaleString()}</dd>
                  <dt>Hash</dt>
                  <dd><span className="hash-display">{block.hash}</span></dd>
                  <dt>Previous Hash</dt>
                  <dd><span className="hash-display">{block.previousHash}</span></dd>
                  <dt>Data</dt>
                  <dd style={{ fontFamily: 'monospace', fontSize: '0.78rem' }}>
                    {JSON.stringify(block.data, null, 2)}
                  </dd>
                </dl>
              </div>
              {i < chain.length - 1 && <div className="block-connector">⬇</div>}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}
