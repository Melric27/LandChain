import React, { useState } from 'react';
import { api } from '../api';

export default function TransferLand({ role }) {
  const [form, setForm] = useState({ landId: '', newOwner: '' });
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    try {
      const res = await api.post('/transferLand', form, role);
      setMsg({ type: 'success', text: res.data.message });
      setForm({ landId: '', newOwner: '' });
    } catch (err) {
      const text = err.response?.data?.error || 'Something went wrong';
      setMsg({ type: 'error', text });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto animate-[fadeIn_0.4s_ease]">
      {/* Hero Section Asymmetry */}
      <section className="mb-16 grid grid-cols-12 gap-8 items-end">
        <div className="col-span-12 lg:col-span-7">
          <span className="font-label text-xs tracking-[0.2em] uppercase text-secondary mb-4 block">Transaction Protocol v4.0</span>
          <h2 className="text-6xl text-primary leading-tight font-headline">Transfer Legal <br/><span className="italic text-tertiary">Estate Ownership</span></h2>
          <p className="mt-6 text-lg text-secondary max-w-lg font-body leading-relaxed">
            Executing a deed transfer on LandChain requires valid parcel identification and recipient digital signature credentials. All transfers are immutably recorded in the ledger.
          </p>
        </div>
        <div className="col-span-12 lg:col-span-5 flex justify-end">
          <div className="bg-surface-container-low p-8 rounded-xl border-l-4 border-primary max-w-sm w-full">
            <p className="text-sm font-label text-secondary mb-2 italic">Current Registry Status</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
              <span className="text-primary font-bold text-xl uppercase tracking-tighter">Syncing: Optimal</span>
            </div>
          </div>
        </div>
      </section>

      {role !== 'admin' && (
        <div className="mb-8 p-4 bg-error-container border border-error/30 text-on-error-container rounded-lg font-label text-sm flex items-center gap-3">
          <span className="material-symbols-outlined">warning</span>
          Admin role required to transfer land. Switch roles in the sidebar.
        </div>
      )}

      {msg && (
        <div className={`mb-8 p-4 rounded-lg font-label text-sm flex items-center gap-3 ${msg.type === 'success' ? 'bg-[#10b981]/10 text-[#059669] border border-[#10b981]/30' : 'bg-error-container text-on-error-container border border-error/30'}`}>
          <span className="material-symbols-outlined">
            {msg.type === 'success' ? 'check_circle' : 'error'}
          </span>
          {msg.text}
        </div>
      )}

      {/* Bento Layout for Form and Details */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left: Primary Transfer Form */}
        <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest p-10 rounded-xl shadow-[0px_20px_40px_rgba(28,28,25,0.03)] border-b-2 border-surface-container-high">
          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Parcel ID */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-tertiary">Parcel Identifier (Land ID)</label>
                <div className="relative">
                  <input 
                    name="landId"
                    value={form.landId}
                    onChange={handleChange}
                    required
                    className="w-full bg-surface-container-low border-0 border-b border-outline-variant/30 focus:ring-0 focus:border-primary px-3 py-3 text-primary font-body text-lg transition-all placeholder:text-outline/50" 
                    placeholder="e.g. LAND-001" 
                    type="text"
                  />
                  <span className="material-symbols-outlined absolute right-3 top-3 text-outline/50">qr_code_scanner</span>
                </div>
                <p className="text-[10px] text-secondary/60">Search by blockchain hash or physical deed ID</p>
              </div>

              {/* Recipient Wallet */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-tertiary">New Owner (Recipient)</label>
                <input 
                  name="newOwner"
                  value={form.newOwner}
                  onChange={handleChange}
                  required
                  className="w-full bg-surface-container-low border-0 border-b border-outline-variant/30 focus:ring-0 focus:border-primary px-3 py-3 text-primary font-body text-lg transition-all placeholder:text-outline/50" 
                  placeholder="e.g. Jane Smith" 
                  type="text"
                />
                <p className="text-[10px] text-secondary/60">Verified LandChain addressed or Real Name required</p>
              </div>
            </div>

            {/* Authorization */}
            <div className="bg-primary/5 p-6 rounded-lg flex items-start gap-4 mt-8">
              <div className="pt-1">
                <input required className="rounded text-primary focus:ring-primary border-outline-variant cursor-pointer" type="checkbox" />
              </div>
              <div>
                <p className="text-sm text-primary-container leading-snug">
                  I confirm that all submitted documentation is legally binding and the digital signature used for this transaction represents my irrevocable consent to the transfer of property title.
                </p>
              </div>
            </div>

            <div className="pt-6 flex justify-between items-center">
              <button disabled className="text-secondary hover:text-primary transition-colors text-sm font-medium underline underline-offset-4 disabled:opacity-50" type="button">Save Draft</button>
              <button 
                type="submit" 
                disabled={loading || role !== 'admin'}
                className="bg-primary text-on-primary px-10 py-4 rounded-md font-bold uppercase tracking-widest text-sm hover:opacity-95 shadow-xl transition-all disabled:opacity-50"
              >
                {loading ? 'Executing...' : 'Execute Transfer'}
              </button>
            </div>
          </form>
        </div>

        {/* Right: Supportive Information */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Map Widget */}
          <div className="bg-surface-container-low rounded-xl overflow-hidden h-64 relative group border border-outline-variant/10">
            <img className="w-full h-full object-cover grayscale-[20%] group-hover:scale-105 transition-all duration-300" alt="Overhead satellite view" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4nYjo8U-QKAWh8FfgqonJHz8_ibl0FrGtQKMFH_dzXBGZ9CvREJfjbBeNv3kXyH9p8px3Y2-B9e30v7H_Ra9UCoW2gyEFkjMn7CAyVf_eagGrH3VxfeqmZLvvUOMAYv1DN5oe7uxJ1s6nMsWOYt-wHpmhDAWAGHLk94IXMGyqXqLx-uZ3P-onm5vNYPNpgTYF33M3-bFzGZ1unTSZeXU9Bu2DKiEEEFdZo5RCn3qK2FsW2hYq-CpGaYTGZ_lJfMbp9nlX55PhtyDS"/>
            <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent"></div>
            <div className="absolute bottom-4 left-4 text-on-primary">
              <p className="text-[10px] uppercase tracking-widest opacity-80">Parcel Preview</p>
              <p className="font-headline italic">Dynamic Load</p>
            </div>
            <div className="absolute top-4 right-4 bg-surface px-3 py-1 rounded-full text-[10px] font-bold text-primary flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px]">location_on</span>
              40.7128° N, 74.0060° W
            </div>
          </div>

          {/* Legal Checklist */}
          <div className="bg-surface-container-high p-8 rounded-xl space-y-6">
            <h3 className="text-xl text-primary border-b border-outline-variant/30 pb-4 font-headline">Verification Checklist</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-sm mt-1">check_circle</span>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-tertiary">Sender Authenticated</p>
                  <p className="text-xs text-secondary">System verified Role access</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-sm mt-1">check_circle</span>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-tertiary">Encumbrance Search</p>
                  <p className="text-xs text-secondary">Zero liens detected</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-outline-variant text-sm mt-1">pending</span>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-secondary">Notary Seal</p>
                  <p className="text-xs text-secondary">Awaiting network consensus over node clusters</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Archive Note */}
          <div className="bg-tertiary p-8 rounded-xl text-on-tertiary-container relative overflow-hidden">
            <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-9xl opacity-5">history_edu</span>
            <p className="text-xs uppercase tracking-[0.2em] mb-4 text-tertiary-fixed font-label">Archivist's Note</p>
            <p className="font-headline italic text-lg leading-relaxed text-surface-bright">
              "Every transfer of land is a ripple in the sea of history. We record it here so that the future may know its origins with absolute certainty."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
