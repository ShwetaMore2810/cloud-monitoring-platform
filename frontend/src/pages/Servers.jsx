// frontend/src/pages/Servers.jsx
import React, { useEffect, useState } from 'react';
import api from '../api';
import AddServer from '../components/AddServer';

export default function Servers() {
  const [servers, setServers] = useState([]);
  const [error, setError] = useState(null);

  const fetchServers = async () => {
    try {
      const resp = await api.get('/servers');
      setServers(resp.data.servers || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch servers');
    }
  };

  useEffect(()=>{ fetchServers(); }, []);

  const handleCreated = (s) => {
    setServers(prev => [s, ...prev]);
  };

  return (
    <div className="p-4 text-white">
      <h2 className="text-xl mb-4">Your Saved Servers</h2>
      <div className="mb-6">
        <AddServer onCreated={handleCreated} />
      </div>
      {error && <div className="text-red-400">{error}</div>}
      <ul className="space-y-2">
        {servers.map(s => (
          <li key={s.id} className="p-3 bg-gray-800 rounded">
            <div className="flex justify-between">
              <div>
                <div className="font-semibold">{s.name || s.host}</div>
                <div className="text-sm text-gray-300">{s.username}@{s.host}</div>
              </div>
              <div className="text-sm text-gray-300">{new Date(s.created_at).toLocaleString()}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}