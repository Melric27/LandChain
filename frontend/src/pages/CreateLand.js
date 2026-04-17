import React, { useState } from 'react';
import { api } from '../api';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

export default function CreateLand({ role }) {
  const [form, setForm] = useState({ owner: '', location: '', area: '', price: '', latitude: null, longitude: null });
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    try {
      const res = await api.post('/createLand', form, role);
      setMsg({ type: 'success', text: res.data.message });
      setForm({ owner: '', location: '', area: '', price: '', latitude: null, longitude: null });
    } catch (err) {
      const text = err.response?.data?.error || 'Something went wrong';
      setMsg({ type: 'error', text });
    } finally {
      setLoading(false);
    }
  };

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setForm((prev) => ({ ...prev, latitude: e.latlng.lat, longitude: e.latlng.lng }));
      },
    });
    return form.latitude && form.longitude ? (
      <Marker position={[form.latitude, form.longitude]} />
    ) : null;
  };

  return (
    <div className="max-w-5xl mx-auto animate-[fadeIn_0.4s_ease]">
      {/* Header Section */}
      <div className="mb-16">
        <span className="font-label text-xs uppercase tracking-[0.3em] text-secondary mb-4 block">Official Documentation</span>
        <h2 className="font-headline text-6xl text-primary font-light leading-tight max-w-2xl mb-6">
          New Property <span className="italic font-normal">Registration</span>
        </h2>
        <div className="flex items-center gap-4">
          <div className="h-[1px] w-12 bg-primary/20"></div>
          <p className="font-label text-sm text-secondary uppercase tracking-wider">Secure Ledger Entry Protocol v2.4</p>
        </div>
      </div>

      {role !== 'admin' && (
        <div className="mb-8 p-4 bg-error-container border border-error/30 text-on-error-container rounded-lg font-label text-sm flex items-center gap-3">
          <span className="material-symbols-outlined">warning</span>
          Admin role required to register land. Switch roles in the sidebar.
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

      {/* Bento Form Grid */}
      <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-8">
        {/* Primary Details */}
        <div className="col-span-12 lg:col-span-7 space-y-8">
          <div className="p-8 bg-surface-container-low rounded-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <span className="material-symbols-outlined text-8xl">qr_code_2</span>
            </div>
            <div className="relative z-10">
              <label className="block font-label text-xs uppercase tracking-widest text-secondary mb-4">Unique Land Identifier</label>
              <input 
                disabled 
                className="w-full bg-transparent border-0 border-b-2 border-outline-variant focus:border-primary focus:ring-0 font-headline text-4xl text-primary placeholder:text-outline-variant/30 transition-all py-2" 
                placeholder="Auto-Generated" 
                type="text"
              />
              <p className="mt-4 font-label text-[10px] text-outline uppercase tracking-widest">Digital fingerprint generated upon verification</p>
            </div>
          </div>

          <div className="p-8 bg-surface-container-low rounded-xl">
            <div className="space-y-4">
              <label className="block font-label text-xs uppercase tracking-widest text-secondary">Owner of Record</label>
              <input 
                name="owner"
                value={form.owner}
                onChange={handleChange}
                required
                className="w-full bg-transparent border-0 border-b border-outline-variant focus:border-primary focus:ring-0 font-headline text-xl text-primary placeholder:text-outline-variant/40 transition-all py-1" 
                placeholder="Full Legal Name" 
                type="text"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="p-8 bg-surface-container-low rounded-xl flex flex-col justify-between aspect-square">
              <div className="space-y-2">
                <label className="block font-label text-xs uppercase tracking-widest text-secondary">Valuation</label>
                <div className="flex items-baseline gap-2">
                  <span className="font-headline text-2xl text-primary">₹</span>
                  <input 
                    name="price"
                    type="number"
                    value={form.price}
                    onChange={handleChange}
                    required
                    className="w-full bg-transparent border-0 border-b border-outline-variant focus:border-primary focus:ring-0 font-headline text-4xl text-primary placeholder:text-outline-variant/40 transition-all py-1" 
                    placeholder="0.00" 
                  />
                </div>
              </div>
              <div className="pt-4 border-t border-outline-variant/10">
                <p className="font-label text-[10px] text-secondary uppercase tracking-tighter">Current market appraisal based on regional index</p>
              </div>
            </div>

            <div className="p-8 bg-surface-container-low rounded-xl flex flex-col justify-between aspect-square">
              <div className="space-y-2">
                <label className="block font-label text-xs uppercase tracking-widest text-secondary">Surface Area</label>
                <div className="flex items-baseline gap-2">
                  <input 
                    name="area"
                    type="number"
                    value={form.area}
                    onChange={handleChange}
                    required
                    className="w-full bg-transparent border-0 border-b border-outline-variant focus:border-primary focus:ring-0 font-headline text-4xl text-primary placeholder:text-outline-variant/40 transition-all py-1" 
                    placeholder="0" 
                  />
                  <span className="font-headline text-xl text-primary whitespace-nowrap">sq ft</span>
                </div>
              </div>
              <div className="pt-4 border-t border-outline-variant/10">
                <p className="font-label text-[10px] text-secondary uppercase tracking-tighter">Verified via satellite geofencing protocol</p>
              </div>
            </div>
          </div>
        </div>

        {/* Location & Context */}
        <div className="col-span-12 lg:col-span-5 space-y-8">
          <div className="p-8 bg-surface-container-high rounded-xl h-full flex flex-col">
            <label className="block font-label text-xs uppercase tracking-widest text-secondary mb-6">Geographic Positioning</label>
            <div className="mb-8 overflow-hidden rounded-lg h-64 bg-surface-variant relative transition-all duration-700">
              <MapContainer center={[20.5937, 78.9629]} zoom={4} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <LocationMarker />
              </MapContainer>
            </div>

            <div className="space-y-6 flex-1">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block font-label text-[10px] uppercase tracking-widest text-outline">Precise Location / Address</label>
                  <input 
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    required
                    className="w-full bg-surface-container-lowest border-0 rounded p-3 font-body text-sm text-primary focus:ring-1 focus:ring-primary transition-all" 
                    placeholder="e.g. Mumbai, Maharashtra" 
                    type="text"
                  />
                </div>
                {form.latitude && form.longitude && (
                  <div className="p-3 bg-surface-container-low rounded border border-outline-variant/30 text-xs text-secondary font-mono">
                    Lat: {form.latitude.toFixed(6)}, Lng: {form.longitude.toFixed(6)}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-12 space-y-4">
              <button 
                disabled={loading || role !== 'admin'}
                className="w-full py-4 bg-primary text-on-primary rounded-lg font-label text-xs uppercase tracking-[0.2em] hover:opacity-90 disabled:opacity-50 transition-all shadow-lg" 
                type="submit"
              >
                {loading ? 'Committing...' : 'Commit to Ledger'}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Metadata Footer */}
      <div className="mt-24 border-t border-outline-variant/20 pt-12 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="space-y-4">
          <span className="font-label text-[10px] uppercase tracking-[0.2em] text-outline">Archival Status</span>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#059669]"></div>
            <p className="font-headline italic text-primary">Ready for Immortality</p>
          </div>
        </div>
        <div className="space-y-4">
          <span className="font-label text-[10px] uppercase tracking-[0.2em] text-outline">Legal Precedent</span>
          <p className="font-body text-sm text-secondary leading-relaxed">This entry complies with the Sovereignty Act of 2024 and ISO-9002 Digital Land Standards.</p>
        </div>
      </div>
    </div>
  );
}
