import React, { useState } from 'react';
import { api } from '../api';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
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
    <div className="max-w-6xl mx-auto animate-[fadeIn_0.5s_ease] min-h-[80vh]">
      {/* Hero Header */}
      <div className="relative mb-20 flex flex-col md:flex-row items-end gap-12">
        <div className="flex-1">
          <span className="font-label text-[10px] tracking-[0.3em] uppercase text-secondary font-bold mb-4 block">Archive Lookup Mode</span>
          <h2 className="font-headline text-6xl md:text-7xl leading-tight text-primary font-semibold -ml-1">
            Registry <span className="italic font-light">Search</span>
          </h2>
          <p className="font-body text-lg text-secondary mt-4 leading-relaxed max-w-xl">
            Retrieve active constraints, ownership proofs, and registered metrics for any property within the LandChain registry.
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
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
          {error && <p className="mt-4 text-sm text-error font-medium">{error}</p>}
        </div>

        <div className="w-full md:w-1/3 aspect-[4/5] bg-surface-container-low overflow-hidden rounded-xl shadow-xl relative translate-y-8 hidden md:block">
          <img className="w-full h-full object-cover grayscale opacity-80 mix-blend-multiply" alt="Abstract map pattern" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCBcfFfdOeSf_sAtj-UxUZtk8E-YuQG9XBrcsqJOhMOUmPA3bZd4BnuANmCcyoyZryYlOsOM2tXWH7BMMfbGYonmhnkSpXEaRtLaNj6_zadNQh304obtZerLZVUoFk7Q1aURunxC2dWJbTHlyAV5qVSg3enKdkwSCRR7biOdPD-G3Kyzkj3ddmiwSsrUsBx-JCgYo0FJmb0hIs-3YeH4_P4JrwxBbVx8IIBmwNXRkeu3pJgR3qQaEEKANduKwYRe9HRABsWP3rnm1JX"/>
          <div className="absolute inset-0 bg-primary/10 mix-blend-multiply"></div>
          <div className="absolute bottom-6 left-6 right-6 p-4 bg-surface-bright/90 backdrop-blur shadow-sm rounded-lg">
            <p className="font-label text-[10px] tracking-widest uppercase font-bold text-primary mb-1">Index Query System</p>
            <p className="font-body text-xs text-secondary font-medium">O(1) Data Retrieval enabled</p>
          </div>
        </div>
      </div>

      {!land && !loading && !error && (
        <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
          <span className="material-symbols-outlined text-6xl mb-4 text-primary">search_insights</span>
          <p className="font-headline text-2xl text-primary">Search Active Ledger</p>
          <p className="font-body text-sm text-secondary">Submit a valid Land ID above to view details</p>
        </div>
      )}

      {land && (
        <div className="mt-20 fade-in pb-20">
          <div className="flex items-center gap-4 mb-8 border-b border-surface-container-high pb-4">
            <span className="material-symbols-outlined text-4xl text-primary">foundation</span>
            <div>
              <h3 className="font-headline text-3xl text-primary">{land.landId}</h3>
              <p className="text-secondary text-sm font-medium uppercase tracking-widest mt-1">Verified Property Record</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-surface-container-lowest p-8 border border-surface-container-high rounded-xl hover:shadow-[0px_10px_30px_rgba(0,0,0,0.03)] transition-all">
              <span className="material-symbols-outlined text-secondary opacity-50 mb-4 block text-3xl">key</span>
              <p className="font-label text-[10px] uppercase tracking-[0.2em] text-secondary font-bold mb-2">Current Owner of Record</p>
              <p className="font-headline text-3xl text-primary mb-6">{land.owner}</p>
              
              <p className="font-label text-[10px] uppercase tracking-[0.2em] text-secondary font-bold mb-2 mt-8">Physical Location</p>
              <p className="font-body text-lg text-tertiary mb-4">{land.location}</p>
              
              {land.latitude && land.longitude && (
                <div className="w-full h-48 rounded-lg overflow-hidden border border-outline-variant/30 mt-4 relative z-0">
                  <MapContainer center={[land.latitude, land.longitude]} zoom={13} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    />
                    <Marker position={[land.latitude, land.longitude]} />
                  </MapContainer>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="bg-surface-container-low p-6 flex flex-col justify-between rounded-xl">
                <div>
                  <p className="font-label text-xs uppercase tracking-widest text-secondary mb-2 block">Surface Area</p>
                  <p className="font-headline text-3xl text-primary">{Number(land.area).toLocaleString()}</p>
                </div>
                <p className="text-xs text-secondary font-medium font-mono mt-2 opacity-50">SQ FT</p>
              </div>

              <div className="bg-surface-container-low p-6 flex flex-col justify-between rounded-xl">
                <div>
                  <p className="font-label text-xs uppercase tracking-widest text-secondary mb-2 block">Appraised Value</p>
                  <p className="font-headline text-3xl text-primary">₹{Number(land.price).toLocaleString()}</p>
                </div>
                <p className="text-xs text-secondary font-medium font-mono mt-2 opacity-50">Local Currency</p>
              </div>
              
              <div className="bg-surface-container-low p-6 flex flex-col justify-between rounded-xl col-span-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="font-label text-xs uppercase tracking-widest text-secondary mb-2 block">Genesis Date</p>
                    <p className="font-body text-sm font-medium text-tertiary">{new Date(land.createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="font-label text-xs uppercase tracking-widest text-secondary mb-2 block">Last Modification</p>
                    <p className="font-body text-sm font-medium text-tertiary">
                      {land.lastTransferredAt ? new Date(land.lastTransferredAt).toLocaleString() : 'Never Transferred'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
