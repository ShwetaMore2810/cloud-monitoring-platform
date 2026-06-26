import { useState, useEffect, useContext } from "react";
import axios from "axios";
import api from "../api";
import Account from "../components/Account.jsx";
import { MetricsContext } from "../context/MetricsContext";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <h1 className="text-white text-xl font-bold">
              Server Metrics Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/history" className="text-white hover:text-gray-300 text-sm">
              📊 View History
            </Link>
            <Account />
          </div>
        </div>
      </div>
    </nav>
  );
};

const HomePage = () => {
  const [serverIp, setServerIp] = useState("");
  const [username, setUsername] = useState("");
  const [pemFile, setPemFile] = useState(null);
  const [fileName, setFileName] = useState("No file chosen");

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(30);

  const [timeLeft, setTimeLeft] = useState(null);
  const [timer, setTimer] = useState(null);

  const { currentMetrics, updateMetrics, startMonitoring, isMonitoring, serverConfig } = useContext(MetricsContext);

  // If monitoring is active from another session, resume here
  useEffect(() => {
    if (isMonitoring && serverConfig) {
      setServerIp(serverConfig.serverIp);
      setUsername(serverConfig.username);
      setPemFile(serverConfig.pemFile);
      setFileName(serverConfig.fileName);
      setAutoRefresh(true);
    }
  }, [isMonitoring, serverConfig]);

  useEffect(() => {
    if (autoRefresh && serverIp && username && pemFile && !loading) {
      const intervalId = setInterval(() => {
        fetchMetrics();
      }, refreshInterval * 1000);
      return () => clearInterval(intervalId);
    }
  }, [autoRefresh, serverIp, username, pemFile, refreshInterval, loading]);

  useEffect(() => {
    if (autoRefresh && timeLeft !== null) {
      if (timeLeft <= 0) {
        setTimeLeft(refreshInterval);
      } else {
        const intervalId = setInterval(() => {
          setTimeLeft((prev) => prev - 1);
        }, 1000);
        setTimer(intervalId);
        return () => clearInterval(intervalId);
      }
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [autoRefresh, timeLeft, refreshInterval]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPemFile(file);
      setFileName(file.name);
    }
  };

  const fetchMetrics = async () => {
    if (!serverIp || !username || !pemFile) {
      setError("Please fill Server IP, Username and choose a PEM file");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("serverIp", serverIp);
      formData.append("username", username);
      formData.append("pemFile", pemFile);

      const response = await api.post("/fetch-metrics", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      updateMetrics(response.data.metrics || null);

      // Start monitoring context
      startMonitoring({
        serverIp,
        username,
        pemFile,
        fileName,
      });

      if (autoRefresh) setTimeLeft(refreshInterval);
    } catch (err) {
      console.error("Error fetching metrics:", err);
      setError(err.response?.data?.error || "Failed to fetch server metrics");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-white lg:px-8 py-8">
        <div className="text-center mb-8 text-white">
          <p className="text-lg text-gray-200 mt-2">
            Monitor your server performance in real-time
          </p>
        </div>

        <div className="bg-black border-2 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl text-white font-semibold mb-4">
            Connect to your server
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="serverIp"
                className="block text-sm font-medium text-gray-200 mb-1"
              >
                Server IP Address
              </label>
              <input
                type="text"
                id="serverIp"
                value={serverIp}
                onChange={(e) => setServerIp(e.target.value)}
                placeholder="e.g., 192.168.1.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-200 mb-1"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g., ubuntu, ec2-user"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="pemFile"
                className="block text-sm font-medium text-gray-200 mb-1"
              >
                PEM File (SSH Private Key)
              </label>
              <div className="flex items-center">
                <label className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 cursor-pointer">
                  Choose File
                  <input
                    type="file"
                    id="pemFile"
                    accept=".pem"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
                <span className="ml-3 text-sm text-gray-100 font-bold">
                  {fileName}
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-200">
                Upload your .pem file to establish an SSH connection
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-4 items-center">
            <button
              onClick={fetchMetrics}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Fetching Metrics...
                </>
              ) : (
                "Get Server Metrics"
              )}
            </button>

            <div className="flex items-center gap-2">
              <input
                id="autoRefresh"
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="autoRefresh" className="text-sm text-white">
                Auto refresh every
              </label>
              <input
                type="number"
                value={refreshInterval}
                onChange={(e) =>
                  setRefreshInterval(Math.max(5, parseInt(e.target.value) || 5))
                }
                min="5"
                className="w-16 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-200">seconds</span>
              {autoRefresh && timeLeft !== null && (
                <span className="text-sm text-gray-200">
                  (refreshing in {timeLeft}s)
                </span>
              )}
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-md">
              <p className="text-sm">{error}</p>
            </div>
          )}
        </div>

        {currentMetrics && (
          <div className="bg-black/80 rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">
                Server Metrics
              </h2>
              <Link
                to="/history"
                className="text-indigo-200 hover:text-indigo-300 text-sm underline"
              >
                → View Full History & Charts
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg shadow-sm">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-medium text-blue-700">CPU Usage</h3>
                  <span className="text-xs font-semibold bg-blue-200 text-blue-800 px-2 py-1 rounded-full">
                    {currentMetrics.cpu?.error ? "Error" : "Real-time"}
                  </span>
                </div>
                {currentMetrics.cpu?.error ? (
                  <p className="text-sm text-red-500 mt-2">{currentMetrics.cpu.error}</p>
                ) : (
                  <div className="mt-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">Usage</span>
                      <span className="text-sm font-medium text-gray-900">
                        {currentMetrics.cpu?.usage?.toFixed(2)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{
                          width: `${Math.min(100, currentMetrics.cpu?.usage || 0)}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg shadow-sm">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-medium text-green-700">Memory</h3>
                  <span className="text-xs font-semibold bg-green-200 text-green-800 px-2 py-1 rounded-full">
                    {currentMetrics.memory?.error ? "Error" : "RAM"}
                  </span>
                </div>
                {currentMetrics.memory?.error ? (
                  <p className="text-sm text-red-500 mt-2">{currentMetrics.memory.error}</p>
                ) : (
                  <div className="mt-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">Usage</span>
                      <span className="text-sm font-medium text-gray-900">
                        {currentMetrics.memory?.usagePercent}% ({currentMetrics.memory?.used} MB
                        / {currentMetrics.memory?.total} MB)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-green-600 h-2.5 rounded-full"
                        style={{ width: `${currentMetrics.memory?.usagePercent || 0}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg shadow-sm">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-medium text-purple-700">Disk</h3>
                  <span className="text-xs font-semibold bg-purple-200 text-purple-800 px-2 py-1 rounded-full">
                    {currentMetrics.disk?.error ? "Error" : "Storage"}
                  </span>
                </div>
                {currentMetrics.disk?.error ? (
                  <p className="text-sm text-red-500 mt-2">{currentMetrics.disk.error}</p>
                ) : (
                  <div className="mt-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">Usage</span>
                      <span className="text-sm font-medium text-gray-900">
                        {currentMetrics.disk?.usagePercent}% ({currentMetrics.disk?.used} /
                        {currentMetrics.disk?.size})
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-purple-600 h-2.5 rounded-full"
                        style={{ width: `${currentMetrics.disk?.usagePercent || 0}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      {currentMetrics.disk?.filesystem} mounted on{" "}
                      {currentMetrics.disk?.mountPoint}
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-lg shadow-sm">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-medium text-amber-700">
                    System Load
                  </h3>
                  <span className="text-xs font-semibold bg-amber-200 text-amber-800 px-2 py-1 rounded-full">
                    {currentMetrics.load?.error ? "Error" : "Average"}
                  </span>
                </div>
                {currentMetrics.load?.error ? (
                  <p className="text-sm text-red-500 mt-2">{currentMetrics.load.error}</p>
                ) : (
                  <div className="mt-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">1 minute:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {currentMetrics.load?.load1}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">5 minutes:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {currentMetrics.load?.load5}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">15 minutes:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {currentMetrics.load?.load15}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 text-sm text-gray-500">
              <p>Last updated: {new Date().toLocaleString()}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
