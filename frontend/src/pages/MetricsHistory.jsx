import { useState, useEffect } from "react";
import api from "../api";
import Account from "../components/Account.jsx";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const Navbar = () => {
  return (
    <nav className="bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <h1 className="text-white text-xl font-bold">Metrics History</h1>
          </div>
          <div className="flex items-center">
            <Account />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default function MetricsHistory() {
  const [serverId, setServerId] = useState("");
  const [servers, setServers] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load user's saved servers
  useEffect(() => {
    const loadServers = async () => {
      try {
        const resp = await api.get("/servers");
        setServers(resp.data.servers || []);
        if (resp.data.servers?.length > 0) {
          setServerId(resp.data.servers[0].id);
        }
      } catch (err) {
        setError("Failed to load servers");
      }
    };
    loadServers();
  }, []);

  // Fetch history when serverId changes
  useEffect(() => {
    if (serverId) {
      fetchHistory();
    }
  }, [serverId]);

  const fetchHistory = async () => {
    if (!serverId) return;
    setLoading(true);
    setError(null);

    try {
      const resp = await api.get(`/metrics/history/${serverId}?limit=100`);
      const data = (resp.data.history || []).reverse().map((item) => ({
        ...item,
        timestamp: new Date(item.collected_at).toLocaleTimeString(),
      }));
      setHistory(data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch history");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-white lg:px-8 py-8">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Select Server
          </label>
          <select
            value={serverId}
            onChange={(e) => setServerId(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md bg-white text-black"
          >
            {servers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name || s.host} ({s.username}@{s.host})
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-md mb-4">
            {error}
          </div>
        )}

        {loading && <p className="text-gray-300">Loading history...</p>}

        {history.length > 0 && (
          <div className="space-y-8">
            <div className="bg-gray-900 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-white mb-4">CPU Usage Over Time</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={history}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="cpu"
                    stroke="#3b82f6"
                    name="CPU %"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-gray-900 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-white mb-4">Memory Usage Over Time</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={history}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="mem_usage_percent"
                    stroke="#10b981"
                    name="Memory %"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-gray-900 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-white mb-4">Disk Usage Over Time</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={history}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="disk_usage_percent"
                    stroke="#a855f7"
                    name="Disk %"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {history.length === 0 && !loading && !error && (
          <p className="text-gray-300">No history data available. Fetch metrics to record data.</p>
        )}
      </div>
    </div>
  );
}
