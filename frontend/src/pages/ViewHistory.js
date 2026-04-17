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
    <div className="max-w-6xl mx-auto animate-[fadeIn_0.5s_ease] min-h-[80vh]">
      {/* Hero Provenance Header */}
      <div className="relative mb-20 flex flex-col md:flex-row items-end gap-12">
        <div className="flex-1">
          <span className="font-label text-[10px] tracking-[0.3em] uppercase text-secondary font-bold mb-4 block">Asset Provenance</span>
          <h2 className="font-headline text-6xl md:text-7xl leading-tight text-primary font-semibold -ml-1">
            Ownership <span className="italic font-light">History</span>
          </h2>
          <p className="font-body text-lg text-secondary mt-4 leading-relaxed max-w-xl">
            Trace the full cryptographic timeline of a land parcel from its initial genesis record through all transfer events.
          </p>

          <form onSubmit={handleSearch} className="mt-8 flex items-center max-w-md relative">
            <input
              value={landId}
              onChange={(e) => setLandId(e.target.value)}
              placeholder="Enter Land ID (e.g. LAND-001)"
              required
              className="w-full bg-surface-container-low border-0 border-b-2 border-outline-variant focus:ring-0 focus:border-primary py-4 pl-4 pr-32 font-headline text-lg text-primary transition-all placeholder:text-outline-variant/60 rounded-t-lg"
            />
            <button 
              type="submit" 
              disabled={loading}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-on-primary px-6 py-2 rounded font-label text-xs uppercase tracking-widest hover:opacity-90 disabled:opacity-50 transition-all font-bold"
            >
              {loading ? 'Lookup...' : 'Lookup'}
            </button>
          </form>
          {error && <p className="mt-4 text-sm text-error font-medium">{error}</p>}
        </div>

        <div className="w-full md:w-1/3 aspect-[4/5] bg-surface-container-low overflow-hidden rounded-xl shadow-xl relative translate-y-8 hidden md:block">
          <img className="w-full h-full object-cover grayscale opacity-80 mix-blend-multiply" alt="Abstract map" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBb0tGItGLyODgzZUoHltxRFCKTT2R8BCrASS3_vLjcyLxEcZNgwu8fDGxklIPE0PibghK0NdJS5OZ82gJCHa68HYjTtfpYejmrtpnQj97BSaGdok_DZKY2RlXliKqmEC-bCFQol9KXj3PCgXw0cr7XtuHW8-b_hqJuPF-Or9t_R0nVW8G7mc2MSO9LyW_YltzRho7dslMb84z-tDAsiybP9nKqs88gt_TEvKJOIVCeso7j0D4uhjZJIGPCZS3G8MjgCaefZz9H24Am"/>
          <div className="absolute inset-0 bg-primary/10 mix-blend-multiply"></div>
          <div className="absolute bottom-6 left-6 right-6 p-4 bg-surface-bright/90 backdrop-blur shadow-sm rounded-lg">
            <p className="font-label text-[10px] tracking-widest uppercase font-bold text-primary mb-1">Archive Search Protocol</p>
            <p className="font-body text-xs text-secondary font-medium">Tracing ledger threads globally</p>
          </div>
        </div>
      </div>

      {!history && !loading && !error && (
        <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
          <span className="material-symbols-outlined text-6xl mb-4 text-primary">history_edu</span>
          <p className="font-headline text-2xl text-primary">Awaiting Request</p>
          <p className="font-body text-sm text-secondary">Submit a valid Land ID to reconstruct the timeline.</p>
        </div>
      )}

      {history && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start mt-20 fade-in">
          {/* Left: Stats & Metadata */}
          <div className="lg:col-span-4 sticky top-32 space-y-12">
            <section>
              <h3 className="font-headline text-xl mb-6 flex items-center gap-2">
                <span className="w-6 h-px bg-primary/30"></span>
                Ledger Summary
              </h3>
              <div className="space-y-4">
                <div className="p-6 bg-surface-container-lowest shadow-sm rounded-xl border-l-4 border-primary">
                  <p className="font-label text-[10px] text-secondary font-bold uppercase mb-1">Total Lifecycle Events</p>
                  <p className="text-4xl font-headline text-on-surface">{history.length} Records</p>
                </div>
                <div className="p-6 bg-surface-container-low rounded-xl">
                  <p className="font-label text-[10px] text-secondary font-bold uppercase mb-1">Asset ID</p>
                  <p className="text-xl font-headline text-on-surface">{landId}</p>
                  {history.length > 0 && (
                    <p className="font-body text-[10px] opacity-60 mt-2 font-mono truncate" title={history[history.length - 1].hash}>
                      LATEST: {history[history.length - 1].hash.substring(0, 16)}...
                    </p>
                  )}
                </div>
              </div>
            </section>
            
            <section>
              <h3 className="font-headline text-xl mb-6 flex items-center gap-2">
                <span className="w-6 h-px bg-primary/30"></span>
                Archivist Notes
              </h3>
              <p className="font-body text-sm leading-relaxed text-secondary italic">
                "The lineage of this parcel is fully verified against cryptographic signatures across all LandChain nodes. The timeline below represents the absolute truth of ownership."
              </p>
            </section>
          </div>

          {/* Right: The Provenance Timeline */}
          <div className="lg:col-span-8 relative">
            {/* Vertical Line */}
            <div className="absolute left-6 top-4 bottom-4 w-px bg-outline-variant/30 hidden sm:block"></div>
            
            {/* Timeline Events */}
            <div className="space-y-16">
              {[...history].reverse().map((entry, i) => {
                const isLatest = i === 0;
                
                return (
                  <div key={i} className={`relative sm:pl-16 ${!isLatest ? 'opacity-80 hover:opacity-100 transition-opacity' : ''}`}>
                    {/* Circle marker */}
                    <div className={`hidden sm:block absolute left-5 top-2 w-2 h-2 rounded-full ${isLatest ? 'bg-primary ring-4 ring-primary-fixed ring-opacity-50 w-3 h-3 left-[18.5px]' : 'bg-outline-variant'}`}></div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2">
                      <div>
                        <span className={`font-label text-[10px] font-bold tracking-[0.2em] uppercase mb-1 block ${isLatest ? 'text-primary' : 'text-secondary'}`}>
                          Block #{entry.blockIndex} • {entry.type === 'CREATE_LAND' ? 'Genesis Record' : 'Transfer Event'}
                        </span>
                        <h4 className="font-headline text-3xl text-on-surface mb-2">
                          {entry.type === 'CREATE_LAND' ? entry.details.owner : entry.details.newOwner}
                        </h4>
                        
                        {entry.type === 'TRANSFER_LAND' && (
                          <div className="flex items-center gap-2 text-sm text-secondary mb-4 bg-surface-container-high px-3 py-1 rounded inline-flex">
                            <span className="material-symbols-outlined text-[16px]">swap_horiz</span>
                            <span>From <strong>{entry.details.previousOwner}</strong></span>
                          </div>
                        )}
                        
                        {entry.type === 'CREATE_LAND' && (
                          <p className="font-body text-sm text-secondary mb-4 bg-surface-container-high px-3 py-1 rounded inline-flex">
                            📍 {entry.details.location}
                          </p>
                        )}
                      </div>
                      <span className="font-headline text-lg italic text-secondary sm:ml-4 whitespace-nowrap mt-2 sm:mt-0">
                        {new Date(entry.timestamp).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}
                      </span>
                    </div>

                    <div className="mt-4 p-5 bg-surface-container-lowest rounded-xl border border-outline-variant/10 shadow-[0px_4px_20px_rgba(0,0,0,0.02)] grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                      <div className="flex gap-4 items-center">
                        <div className="w-12 h-12 rounded-lg bg-surface-container-low flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-primary">
                            {entry.type === 'CREATE_LAND' ? 'flag' : 'verified_user'}
                          </span>
                        </div>
                        <div>
                          <p className="font-label text-[10px] font-bold uppercase text-secondary">
                            {entry.type === 'CREATE_LAND' ? 'Initial Registration' : 'Consensus Verified'}
                          </p>
                          <p className="font-body text-xs text-on-surface mt-0.5">
                            {new Date(entry.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <div className="md:text-right">
                        <p className="font-label text-[8px] font-bold uppercase text-outline tracking-widest mb-1">Transaction Hash</p>
                        <p className="font-mono text-[10px] text-secondary truncate bg-surface-container px-2 py-1 rounded">
                          {entry.hash}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-20 flex justify-center pb-12 opacity-50">
              <span className="material-symbols-outlined text-4xl">history_edu</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
