import React, { useState } from 'react';
import { api } from '../api';

export default function CreateLand({ role }) {
  const [form, setForm] = useState({ landId: '', owner: '', location: '', area: '', price: '' });
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
      setForm({ landId: '', owner: '', location: '', area: '', price: '' });
    } catch (err) {
      const text = err.response?.data?.error || 'Something went wrong';
      setMsg({ type: 'error', text });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <h2>Register New Land</h2>
        <p>Add a new land parcel to the blockchain ledger</p>
      </div>

      {role !== 'admin' && (
        <div className="alert alert-warning">⚠️ Admin role required to register land. Switch roles in the sidebar.</div>
      )}

      {msg && <div className={`alert alert-${msg.type}`}>{msg.type === 'success' ? '✅' : '❌'} {msg.text}</div>}

      <div className="card" style={{ maxWidth: 640 }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Land ID</label>
            <input name="landId" value={form.landId} onChange={handleChange} placeholder="e.g. LAND-001" required />
          </div>
          <div className="form-group">
            <label>Owner Name</label>
            <input name="owner" value={form.owner} onChange={handleChange} placeholder="e.g. John Doe" required />
          </div>
          <div className="form-group">
            <label>Location</label>
            <input name="location" value={form.location} onChange={handleChange} placeholder="e.g. Mumbai, Maharashtra" required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Area (sq ft)</label>
              <input name="area" type="number" value={form.area} onChange={handleChange} placeholder="e.g. 2500" required />
            </div>
            <div className="form-group">
              <label>Price (₹)</label>
              <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="e.g. 5000000" required />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading || role !== 'admin'}>
            {loading ? 'Registering...' : '📝 Register Land'}
          </button>
        </form>
      </div>
    </div>
  );
}
