// frontend/src/components/AddServer.jsx
import React, { useState } from 'react';
import api from '../api';

export default function AddServer({ onCreated }) {
  const [name, setName] = useState('');
  const [host, setHost] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!host || !username) { setError('host and username required'); return; }
    setLoading(true);
    try {
      const resp = await api.post('/servers', { name, host, username, auth_type: 'pem' });
      onCreated && onCreated(resp.data.server);
      setName(''); setHost(''); setUsername('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create server');
    } finally { setLoading(false); }
  };

  return (
    <form onSubmit={submit} className="space-y-2">
      {error && <div className="text-red-400">{error}</div>}
      <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Server name (optional)" className="input" />
      <input value={host} onChange={(e)=>setHost(e.target.value)} placeholder="Host (IP or hostname)" className="input" />
      <input value={username} onChange={(e)=>setUsername(e.target.value)} placeholder="SSH username" className="input" />
      <button type="submit" disabled={loading} className="bg-indigo-600 text-white px-3 py-1 rounded">{loading ? 'Saving...' : 'Save Server'}</button>
    </form>
  );
}