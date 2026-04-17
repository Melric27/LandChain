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
    <div className="max-w-[1440px] mx-auto animate-[fadeIn_0.4s_ease]">
      {/* Hero Section */}
      <section className="mb-16">
        <div className="flex flex-col md:flex-row items-end justify-between gap-8">
          <div className="max-w-2xl">
            <span className="text-xs font-bold tracking-[0.2em] text-secondary uppercase mb-4 block">Archive Status Dashboard</span>
            <h2 className="font-headline text-6xl md:text-7xl font-light text-primary leading-tight -ml-1">
              Immutable Records of the <br />
              <span className="italic font-normal">Sovereign Earth.</span>
            </h2>
          </div>
          <div className="p-6 bg-surface-container-low rounded-xl border-l-4 border-primary max-w-xs">
            <div className="flex items-center gap-2 mb-2">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${stats.valid === false ? 'bg-error' : 'bg-[#2b6860]'}`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${stats.valid === false ? 'bg-error' : 'bg-[#2b6860]'}`}></span>
              </span>
              <span className="text-[10px] uppercase tracking-widest font-bold text-primary">
                Chain Integrity: {loading ? 'Checking...' : (stats.valid ? 'Active' : 'Compromised')}
              </span>
            </div>
            <p className="text-xs text-secondary leading-relaxed">
              The decentralized ledger is synchronized across the LandChain nodes globally. Integrity verified right now.
            </p>
          </div>
        </div>
      </section>

      {/* High Level Stats Bento Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {/* Total Registered Lands */}
        <div className="bg-surface-container-low p-8 rounded-xl relative overflow-hidden group">
          <div className="relative z-10">
            <div className="text-xs font-bold text-secondary tracking-widest uppercase mb-2">Registered Assets</div>
            <div className="font-headline text-5xl text-primary mb-4">{loading ? '...' : stats.lands}</div>
            <div className="flex items-center gap-2 text-xs text-primary font-medium">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              <span>Total properties secured</span>
            </div>
          </div>
          <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-9xl opacity-5 group-hover:scale-110 transition-transform duration-500">foundation</span>
        </div>

        {/* Total Blocks */}
        <div className="bg-primary p-8 rounded-xl relative overflow-hidden text-on-primary group">
          <div className="relative z-10">
            <div className="text-xs font-bold opacity-70 tracking-widest uppercase mb-2">Blockchain Height</div>
            <div className="font-headline text-5xl mb-4">{loading ? '...' : stats.blocks}</div>
            <div className="text-[10px] font-mono opacity-50 break-all leading-tight">Blocks minted on chain</div>
          </div>
          <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-9xl opacity-10 group-hover:rotate-12 transition-transform duration-500">database</span>
        </div>

        {/* Network Access */}
        <div className="bg-surface-container-low p-8 rounded-xl relative overflow-hidden group">
          <div className="relative z-10">
            <div className="text-xs font-bold text-secondary tracking-widest uppercase mb-2">Network Access</div>
            <div className="font-headline text-5xl text-primary mb-4" style={{ textTransform: 'capitalize' }}>{role}</div>
            <div className="flex items-center gap-2 text-xs text-secondary">
              <span className="material-symbols-outlined text-sm">key</span>
              <span>Current Operating Mode</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions Map */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-headline text-3xl text-tertiary">Quick Actions</h3>
          </div>
          <div className="space-y-4">
            <Link to="/create" className="flex items-center gap-6 p-4 bg-surface-container-lowest hover:bg-surface-container-low transition-colors rounded-lg group">
              <div className="h-12 w-1 bg-primary group-hover:h-full transition-all"></div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-headline text-lg text-tertiary">Register New Land</h4>
                </div>
                <div className="flex items-center gap-4 text-xs text-secondary">
                  <span className="font-bold uppercase tracking-widest">Admin Action</span>
                  <span className="opacity-50">Create Genesis Token</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-primary opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward_ios</span>
            </Link>

            <Link to="/transfer" className="flex items-center gap-6 p-4 bg-surface-container-lowest hover:bg-surface-container-low transition-colors rounded-lg group">
              <div className="h-12 w-1 bg-secondary group-hover:h-full transition-all"></div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-headline text-lg text-tertiary">Transfer Ownership</h4>
                </div>
                <div className="flex items-center gap-4 text-xs text-secondary">
                  <span className="font-bold uppercase tracking-widest">Admin Action</span>
                  <span className="opacity-50">Transfer Titles Securely</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-primary opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward_ios</span>
            </Link>
            
            <Link to="/chain" className="flex items-center gap-6 p-4 bg-surface-container-lowest hover:bg-surface-container-low transition-colors rounded-lg group">
              <div className="h-12 w-1 bg-primary group-hover:h-full transition-all"></div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-headline text-lg text-tertiary">Explore Blockchain</h4>
                </div>
                <div className="flex items-center gap-4 text-xs text-secondary">
                  <span className="font-bold uppercase tracking-widest">Public Action</span>
                  <span className="opacity-50">View all blocks</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-primary opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward_ios</span>
            </Link>
          </div>
        </div>

        {/* Visual Info */}
        <div className="lg:col-span-5">
          <div className="relative rounded-2xl overflow-hidden shadow-[0px_20px_40px_rgba(28,28,25,0.06)] aspect-[4/5] bg-surface-container-high">
            <img className="w-full h-full object-cover grayscale brightness-90 hover:grayscale-0 transition-all duration-700" alt="Map View" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1avGYXLvZFD0wP1mTO9u798SiwANnQu_Nml4YHwyjiuYE8aBiwMubeXHu82xZg8dGn0e-ApFKc9z6-MN4_NOUdcR5TvEv6e5Tuqbjhj-n6jI5J1nhIxZOibtrtibjnqPOmnZYVO6sT0xvaG2wvQBu3k_O7f9L6jK9GICknJZ-wxLChsdy5vmFr1F661MCcV_LDK71GxpD7R-JNHA4KMM-SDi4WU4V93VLVHECSRwL20t_ilFzSThomVBtdaCLB-YEt5RSTTSvwx0m" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent flex flex-col justify-end p-8 text-on-primary">
              <div className="font-headline text-2xl mb-2">Global Registry Coverage</div>
              <p className="text-sm opacity-80 mb-6">Explore the physical dimension of the ledger. Zoom into individual parcels to see cryptographic provenance threads.</p>
              <Link to="/view" className="w-full py-4 bg-surface text-primary rounded-lg font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-surface-container-low transition-colors">
                <span className="material-symbols-outlined text-sm">search</span>
                Lookup specific records
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Tertiary Info Cards */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-16 pb-12">
        <div className="p-6 bg-surface-container-low rounded-lg">
          <span className="material-symbols-outlined text-primary mb-4">gavel</span>
          <div className="text-xs font-bold text-secondary uppercase mb-1">Legal Compliant</div>
          <p className="text-xs text-tertiary">Fully integrated with Basel IV standards for digital asset registration.</p>
        </div>
        <div className="p-6 bg-surface-container-low rounded-lg">
          <span className="material-symbols-outlined text-primary mb-4">history_edu</span>
          <div className="text-xs font-bold text-secondary uppercase mb-1">Audit Trail</div>
          <p className="text-xs text-tertiary">100% of historical ownership changes are preserved in archival nodes.</p>
        </div>
        <div className="p-6 bg-surface-container-low rounded-lg">
          <span className="material-symbols-outlined text-primary mb-4">shield</span>
          <div className="text-xs font-bold text-secondary uppercase mb-1">Quantum Safe</div>
          <p className="text-xs text-tertiary">Utilizing post-quantum lattice-based encryption for long-term security.</p>
        </div>
        <div className="p-6 bg-surface-container-low rounded-lg">
          <span className="material-symbols-outlined text-primary mb-4">public</span>
          <div className="text-xs font-bold text-secondary uppercase mb-1">Eco-Friendly</div>
          <p className="text-xs text-tertiary">Proof-of-Stake consensus with carbon-neutral offset protocols.</p>
        </div>
      </section>
    </div>
  );
}
