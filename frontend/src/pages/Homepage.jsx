import { useState, useEffect } from 'react';
import axios from 'axios';
import Account from '../components/Account.jsx';

const Navbar = () => {
  return (
    <nav className="bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <h1 className="text-white text-xl font-bold">Server Metrics Dashboard</h1>
          </div>
          <div className="flex items-center">
            <Account />
          </div>
        </div>
      </div>
    </nav>
  );
};

const HomePage = () => {
  // State for form inputs
  const [serverIp, setServerIp] = useState('');
  const [username, setUsername] = useState('');
  const [pemFile, setPemFile] = useState(null);
  const [fileName, setFileName] = useState('No file chosen');
  
  // State for metrics and UI
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(30);

  // State for refresh timer
  const [timeLeft, setTimeLeft] = useState(null);
  const [timer, setTimer] = useState(null);

  // Auto refresh effect
  useEffect(() => {
    if (autoRefresh && serverIp && username && pemFile && !loading) {
      const intervalId = setInterval(() => {
        fetchMetrics();
      }, refreshInterval * 1000);
      
      return () => clearInterval(intervalId);
    }
  }, [autoRefresh, serverIp, username, pemFile, refreshInterval, loading]);

  // Timer countdown effect
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

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPemFile(file);
      setFileName(file.name);
    }
  };

  // Fetch metrics from the server
  const fetchMetrics = async () => {
    if (!serverIp || !username || !pemFile) {
      setError('Please fill all fields and choose a PEM file');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('serverIp', serverIp);
      formData.append('username', username);
      formData.append('pemFile', pemFile);

      const response = await axios.post('http://localhost:3000/api/fetch-metrics', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMetrics(response.data.metrics);
      
      if (autoRefresh) {
        setTimeLeft(refreshInterval);
      }
    } catch (err) {
      console.error('Error fetching metrics:', err);
      setError(err.response?.data?.error || 'Failed to fetch server metrics');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black min-h-screen">
      {/* Added Navbar component here */}
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6  text-white lg:px-8 py-8 ">
        <div className="text-center mb-8 text-white">
          <p className="text-lg text-gray-200 mt-2">
            Monitor your server performance in real-time
          </p>
        </div>

        {/* Server Connection Form */}
        <div className="bg-black border-2 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl text-white font-semibold mb-4">Connect to your server</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="serverIp" className="block text-sm font-medium text-gray-200 mb-1">
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
              <label htmlFor="username" className="block text-sm font-medium text-gray-200 mb-1">
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
              <label htmlFor="pemFile" className="block text-sm font-medium text-gray-200 mb-1">
                PEM File (SSH Private Key)
              </label>
              <div className="flex items-center">
                <label className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:border-indigo-900 focus:ring ring-indigo-300 cursor-pointer">
                  Choose File
                  <input
                    type="file"
                    id="pemFile"
                    accept=".pem"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
                <span className="ml-3 text-sm text-gray-100 text-bold">{fileName}</span>
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
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Fetching Metrics...
                </>
              ) : 'Get Server Metrics'}
            </button>

            <div className="flex items-center">
              <input
                id="autoRefresh"
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="autoRefresh" className="ml-2 block text-sm text-white">
                Auto refresh every
              </label>
              <input
                type="number"
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(Math.max(5, parseInt(e.target.value) || 5))}
                min="5"
                className="ml-2 w-16 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <span className="ml-1 text-sm text-gray-200">seconds</span>
              {autoRefresh && timeLeft !== null && (
                <span className="ml-2 text-sm text-gray-200">
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

        {/* Metrics Display */}
        {metrics && (
          <div className="bg-black/80 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Server Metrics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* CPU Usage */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg shadow-sm">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-medium text-blue-700">CPU Usage</h3>
                  <span className="text-xs font-semibold bg-blue-200 text-blue-800 px-2 py-1 rounded-full">
                    {metrics.cpu?.error ? 'Error' : 'Real-time'}
                  </span>
                </div>
                
                {metrics.cpu?.error ? (
                  <p className="text-sm text-red-500 mt-2">{metrics.cpu.error}</p>
                ) : (
                  <div className="mt-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">Usage</span>
                      <span className="text-sm font-medium text-gray-900">{metrics.cpu?.usage?.toFixed(2)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${Math.min(100, metrics.cpu?.usage || 0)}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Memory Usage */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg shadow-sm">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-medium text-green-700">Memory</h3>
                  <span className="text-xs font-semibold bg-green-200 text-green-800 px-2 py-1 rounded-full">
                    {metrics.memory?.error ? 'Error' : 'RAM'}
                  </span>
                </div>
                
                {metrics.memory?.error ? (
                  <p className="text-sm text-red-500 mt-2">{metrics.memory.error}</p>
                ) : (
                  <div className="mt-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">Usage</span>
                      <span className="text-sm font-medium text-gray-900">
                        {metrics.memory?.usagePercent}% ({metrics.memory?.used} MB / {metrics.memory?.total} MB)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-green-600 h-2.5 rounded-full" 
                        style={{ width: `${metrics.memory?.usagePercent || 0}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Disk Usage */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg shadow-sm">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-medium text-purple-700">Disk</h3>
                  <span className="text-xs font-semibold bg-purple-200 text-purple-800 px-2 py-1 rounded-full">
                    {metrics.disk?.error ? 'Error' : 'Storage'}
                  </span>
                </div>
                
                {metrics.disk?.error ? (
                  <p className="text-sm text-red-500 mt-2">{metrics.disk.error}</p>
                ) : (
                  <div className="mt-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">Usage</span>
                      <span className="text-sm font-medium text-gray-900">
                        {metrics.disk?.usagePercent}% ({metrics.disk?.used} / {metrics.disk?.size})
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-purple-600 h-2.5 rounded-full" 
                        style={{ width: `${metrics.disk?.usagePercent || 0}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      {metrics.disk?.filesystem} mounted on {metrics.disk?.mountPoint}
                    </div>
                  </div>
                )}
              </div>
              
              {/* System Load */}
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-lg shadow-sm">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-medium text-amber-700">System Load</h3>
                  <span className="text-xs font-semibold bg-amber-200 text-amber-800 px-2 py-1 rounded-full">
                    {metrics.load?.error ? 'Error' : 'Average'}
                  </span>
                </div>
                
                {metrics.load?.error ? (
                  <p className="text-sm text-red-500 mt-2">{metrics.load.error}</p>
                ) : (
                  <div className="mt-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">1 minute:</span>
                      <span className="text-sm font-medium text-gray-900">{metrics.load?.load1}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">5 minutes:</span>
                      <span className="text-sm font-medium text-gray-900">{metrics.load?.load5}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">15 minutes:</span>
                      <span className="text-sm font-medium text-gray-900">{metrics.load?.load15}</span>
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