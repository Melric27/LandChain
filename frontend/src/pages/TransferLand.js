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
    <div className="fade-in">
      <div className="page-header">
        <h2>Transfer Land Ownership</h2>
        <p>Transfer an existing land parcel to a new owner</p>
      </div>

      {role !== 'admin' && (
        <div className="alert alert-warning">⚠️ Admin role required to transfer land. Switch roles in the sidebar.</div>
      )}

      {msg && <div className={`alert alert-${msg.type}`}>{msg.type === 'success' ? '✅' : '❌'} {msg.text}</div>}

      <div className="card" style={{ maxWidth: 640 }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Land ID</label>
            <input name="landId" value={form.landId} onChange={handleChange} placeholder="e.g. LAND-001" required />
          </div>
          <div className="form-group">
            <label>New Owner</label>
            <input name="newOwner" value={form.newOwner} onChange={handleChange} placeholder="e.g. Jane Smith" required />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading || role !== 'admin'}>
            {loading ? 'Transferring...' : '🔄 Transfer Ownership'}
          </button>
        </form>
      </div>
    </div>
  );
}
