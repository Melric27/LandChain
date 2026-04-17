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
    <div className="max-w-7xl mx-auto animate-[fadeIn_0.5s_ease]">
      {/* Header Section with Asymmetry */}
      <section className="mb-16 relative">
        <span className="text-primary text-xs font-bold uppercase tracking-[0.3em] mb-4 block">Blockchain Explorer</span>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <h2 className="text-6xl md:text-7xl font-headline font-light text-primary leading-tight -ml-1">
              LandChain <br/> <span className="italic font-serif opacity-80">Public Ledger</span>
            </h2>
            <p className="mt-6 text-secondary text-lg leading-relaxed font-light max-w-xl">
              A definitive record of property provenance, immutably secured on the blockchain. Verifying the historical continuity of physical assets in the digital age.
            </p>
          </div>
          <div className="flex gap-4">
            <button onClick={fetchData} disabled={loading} className="bg-primary text-on-primary px-8 py-4 rounded-lg flex items-center gap-3 hover:opacity-90 transition-all disabled:opacity-50">
              <span className="material-symbols-outlined">{loading ? 'sync' : 'refresh'}</span>
              <span className="text-sm font-medium uppercase tracking-wider">Sync State</span>
            </button>
          </div>
        </div>
      </section>

      {/* Network Health & Integrity */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-16">
        <div className="md:col-span-8 bg-surface-container-low rounded-xl p-8 flex flex-col justify-between border-l-4 border-primary">
          <div className="flex justify-between items-start mb-8">
            <div>
              <span className="bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded">
                Chain Integrity Status
              </span>
              <h3 className="text-3xl font-headline mt-4">
                {loading ? 'Verifying...' : validation?.valid ? 'Chain is Valid & Secure' : 'Integrity Compromised'}
              </h3>
              <p className="font-mono text-xs text-secondary mt-1">
                Latest hash matches: {chain.length > 0 ? chain[chain.length - 1].hash.substring(0, 24) + '...' : 'None'}
              </p>
            </div>
            {validation && (
              <div className="text-right">
                <span className={`material-symbols-outlined text-4xl ${validation.valid ? 'text-green-600' : 'text-red-600'}`}>
                  {validation.valid ? 'verified_user' : 'gpp_bad'}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="md:col-span-4 bg-tertiary text-on-tertiary rounded-xl p-8 flex flex-col justify-center items-center text-center">
          <span className="material-symbols-outlined text-4xl mb-4 opacity-50">database</span>
          <p className="text-4xl font-headline mb-2 tracking-tighter">{chain.length > 0 ? chain.length : 0}</p>
          <p className="text-xs uppercase tracking-widest text-on-tertiary-container font-medium">Blocks in Ledger</p>
        </div>
      </section>

      {/* Ledger Table Section */}
      <section className="mb-24">
        <div className="flex justify-between items-center mb-8 border-b border-surface-container-high pb-4">
          <h3 className="text-2xl font-headline text-tertiary">Immutable Block Thread</h3>
        </div>

        {loading ? (
          <div className="text-center py-12 text-secondary font-label uppercase tracking-widest text-sm animate-pulse">Syncing Blockchain Data...</div>
        ) : (
          <div className="space-y-4">
            {[...chain].reverse().map((block, index) => (
              <div key={block.index} className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 bg-surface border border-outline-variant/20 hover:bg-surface-container-low transition-all items-start rounded-xl group relative overflow-hidden">
                {block.index === 0 && (
                  <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-bl-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary/40 mr-2 mb-2 text-xl">star</span>
                  </div>
                )}
                
                <div className="col-span-1 lg:col-span-2">
                  <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-1">Index</p>
                  <p className="text-3xl font-headline text-primary">#{block.index}</p>
                  <p className="text-[10px] text-secondary/60 mt-1 uppercase">
                    {new Date(block.timestamp).toLocaleTimeString()}
                  </p>
                </div>

                <div className="col-span-1 lg:col-span-3">
                  <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-1">Action Type</p>
                  <p className="text-sm font-medium pt-1">
                    {block.index === 0 ? (
                      <span className="bg-primary/10 text-primary px-3 py-1 rounded text-xs">GENESIS BLOCK</span>
                    ) : (
                      <span className="bg-tertiary/10 text-tertiary px-3 py-1 rounded text-xs">{block.data.type}</span>
                    )}
                  </p>
                  {block.index !== 0 && (
                    <p className="text-xs mt-2 font-mono text-secondary"><span className="opacity-50">Target ID:</span> {block.data.landId}</p>
                  )}
                </div>

                <div className="col-span-1 lg:col-span-7 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">Block Hash</p>
                      <p className="text-xs font-mono text-primary bg-primary/5 p-2 rounded truncate" title={block.hash}>
                        {block.hash}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">Previous Hash</p>
                      <p className="text-xs font-mono text-secondary bg-surface-container-high p-2 rounded truncate" title={block.previousHash}>
                        {block.previousHash}
                      </p>
                    </div>
                  </div>
                  
                  {block.index !== 0 && (
                    <div className="mt-4">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">Payload Data</p>
                      <div className="bg-surface-container p-3 rounded text-xs font-mono text-tertiary/80 whitespace-pre-wrap overflow-x-auto">
                        {JSON.stringify(block.data, null, 2)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
