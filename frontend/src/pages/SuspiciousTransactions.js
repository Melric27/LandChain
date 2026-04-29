import React, { useState, useEffect } from 'react';
import { api } from '../api';

export default function SuspiciousTransactions({ role }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, high, medium

  useEffect(() => {
    if (role !== 'admin') return;

    const fetchSuspicious = async () => {
      try {
        const res = await api.get('/suspicious', role);
        setTransactions(res.data.suspicious || []);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch suspicious transactions');
      } finally {
        setLoading(false);
      }
    };

    fetchSuspicious();
  }, [role]);

  if (role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
        <span className="material-symbols-outlined text-6xl mb-4 text-error">gpp_bad</span>
        <p className="font-headline text-2xl text-primary">Access Denied</p>
        <p className="font-body text-sm text-secondary">Only administrators can view fraud detection alerts.</p>
      </div>
    );
  }

  const filteredTransactions = transactions.filter(t => {
    if (filter === 'high') return t.score >= 70;
    if (filter === 'medium') return t.score < 70 && t.score >= 40;
    return true;
  }).sort((a, b) => b.score - a.score);

  return (
    <div className="max-w-6xl mx-auto animate-[fadeIn_0.5s_ease] min-h-[80vh]">
      {/* Header */}
      <div className="relative mb-12">
        <span className="font-label text-[10px] tracking-[0.3em] uppercase text-error font-bold mb-4 block">Security Center</span>
        <h2 className="font-headline text-5xl md:text-6xl leading-tight text-primary font-semibold -ml-1">
          Fraud <span className="italic font-light">Alerts</span>
        </h2>
        <p className="font-body text-lg text-secondary mt-4 leading-relaxed max-w-xl">
          Real-time AI detection for circular ownership, repeated transactions, and high-frequency anomalies.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-8">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 font-label text-xs uppercase tracking-widest rounded-lg transition-colors ${filter === 'all' ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-secondary hover:bg-outline-variant/20'}`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('high')}
          className={`px-4 py-2 font-label text-xs uppercase tracking-widest rounded-lg transition-colors flex items-center gap-2 ${filter === 'high' ? 'bg-error text-white' : 'bg-surface-container-high text-secondary hover:bg-error/10'}`}
        >
          <span className="w-2 h-2 rounded-full bg-error"></span> High Risk (&gt;70%)
        </button>
        <button
          onClick={() => setFilter('medium')}
          className={`px-4 py-2 font-label text-xs uppercase tracking-widest rounded-lg transition-colors flex items-center gap-2 ${filter === 'medium' ? 'bg-[#d97706] text-white' : 'bg-surface-container-high text-secondary hover:bg-[#d97706]/10'}`}
        >
          <span className="w-2 h-2 rounded-full bg-[#d97706]"></span> Moderate Risk
        </button>
      </div>

      {error && <p className="text-error font-medium mb-4">{error}</p>}

      {loading ? (
         <div className="flex justify-center p-12">
           <span className="material-symbols-outlined animate-spin text-4xl text-primary">sync</span>
         </div>
      ) : filteredTransactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center opacity-40 bg-surface-container-lowest rounded-xl border border-surface-container-high">
          <span className="material-symbols-outlined text-6xl mb-4 text-primary">verified_user</span>
          <p className="font-headline text-2xl text-primary">No Suspicious Activity</p>
          <p className="font-body text-sm text-secondary">The ML model has not detected any fraudulent patterns.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredTransactions.map(tx => {
            const isHigh = tx.score >= 70;
            return (
              <div key={tx.id} className={`p-6 border rounded-xl shadow-sm transition-all hover:shadow-md bg-surface-container-lowest ${isHigh ? 'border-error/50' : 'border-[#d97706]/50'}`}>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full flex items-center justify-center ${isHigh ? 'bg-error/10 text-error' : 'bg-[#d97706]/10 text-[#d97706]'}`}>
                      <span className="material-symbols-outlined text-2xl">
                        {isHigh ? 'warning' : 'info'}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-headline text-xl font-semibold text-primary">{tx.landId}</h3>
                      <p className="text-secondary text-xs mt-1">{new Date(tx.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className={`px-4 py-2 rounded-lg flex flex-col items-end ${isHigh ? 'bg-error text-white' : 'bg-[#d97706] text-white'}`}>
                    <span className="text-[10px] uppercase tracking-widest font-bold opacity-80 mb-1">Fraud Score</span>
                    <span className="font-headline text-2xl">{tx.score.toFixed(1)}%</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-2">
                  <div className="bg-surface-container-low p-4 rounded-lg">
                    <p className="font-label text-[10px] uppercase tracking-widest text-secondary font-bold mb-2">Transaction Parties</p>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-4 gap-4">
                      <div className="flex-1 w-full truncate">
                        <p className="text-xs text-secondary mb-1">Seller</p>
                        <p className="font-mono text-sm truncate text-primary" title={tx.seller}>{tx.seller}</p>
                      </div>
                      <span className="material-symbols-outlined text-secondary mx-4 opacity-50 hidden sm:block">arrow_forward</span>
                      <div className="flex-1 w-full truncate">
                        <p className="text-xs text-secondary mb-1">Buyer</p>
                        <p className="font-mono text-sm truncate text-primary" title={tx.buyer}>{tx.buyer}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-surface-container-low p-4 rounded-lg flex flex-col justify-center">
                    <p className="font-label text-[10px] uppercase tracking-widest text-secondary font-bold mb-2">Detection Insights</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      {tx.reasons.map((r, i) => (
                        <li key={i} className="text-sm font-medium text-primary">{r}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  );
}
