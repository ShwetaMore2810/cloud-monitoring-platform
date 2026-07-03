import { useState, useEffect } from 'react'
import api from '../api'
import { BarChart3, RefreshCw, AlertCircle, Loader, TrendingUp, Clock } from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'

function TopBar() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0a0a0f]/60 border-b border-neko-border/40 shadow-lg shadow-neko-purple/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-neko-purple/20 flex items-center justify-center">
            <TrendingUp size={24} className="text-neko-purple-light" />
          </div>
          <h1 className="text-2xl font-black text-white">Metrics History</h1>
        </div>
      </div>
    </header>
  )
}

export default function MetricsHistory() {
  const [serverId, setServerId] = useState('')
  const [servers, setServers] = useState([])
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isLoadingServers, setIsLoadingServers] = useState(true)
  const [lastFetched, setLastFetched] = useState(null)

  useEffect(() => {
    const loadServers = async () => {
      setIsLoadingServers(true)
      setError(null)
      try {
        const resp = await api.get('/servers')
        const list = resp.data.servers || []
        setServers(list)
        if (list.length > 0) setServerId(String(list[0].id))
      } catch (err) {
        if (err.response?.status === 401) {
          setError('⚠️ Authentication failed. Please ensure your backend is properly configured with authentication middleware.')
        } else {
          setError(err.response?.data?.error || 'Failed to load servers')
        }
        console.error('Error loading servers:', err)
      } finally {
        setIsLoadingServers(false)
      }
    }
    loadServers()
  }, [])

  useEffect(() => {
    if (serverId) fetchHistory()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverId])

  const fetchHistory = async () => {
    setLoading(true)
    setError(null)
    try {
      const resp = await api.get(`/metrics/history/${serverId}?limit=100`)
      const data = (resp.data.history || []).reverse().map((item) => ({
        ...item,
        timestamp: new Date(item.collected_at).toLocaleTimeString(),
        cpu: Number(item.cpu) || 0,
        mem_usage_percent: Number(item.mem_usage_percent) || 0,
        disk_usage_percent: Number(item.disk_usage_percent) || 0,
      }))
      setHistory(data)
      setLastFetched(new Date().toLocaleTimeString())
    } catch (err) {
      if (err.response?.status === 401) {
        setError('⚠️ Authentication failed. Please ensure your backend is properly configured.')
      } else {
        setError(err.response?.data?.error || 'Failed to fetch history')
      }
      console.error('Error fetching history:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#1a1a2e] to-[#0f0f1f]">
      {/* Background Pattern */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-neko-purple/5 to-transparent opacity-30"></div>
        <div className="absolute top-0 -left-40 w-80 h-80 bg-neko-purple/8 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
      </div>

      <div className="relative z-10">
        <TopBar />

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Server Selector */}
          <div className="mb-8 group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-neko-purple/20 to-neko-purple/5 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-500 pointer-events-none"></div>
            
            <div className="relative bg-gradient-to-br from-neko-panel/80 to-neko-panel/40 border border-neko-border/50 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-bold text-slate-200 uppercase tracking-widest">Select Server</label>
                {lastFetched && (
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Clock size={14} />
                    <span>Last fetched: {lastFetched}</span>
                  </div>
                )}
              </div>
              
              {isLoadingServers ? (
                <div className="flex items-center gap-2 text-slate-400">
                  <Loader size={16} className="animate-spin" />
                  Loading servers...
                </div>
              ) : servers.length === 0 ? (
                <p className="text-slate-400 text-sm font-light">No servers available</p>
              ) : (
                <select
                  value={serverId}
                  onChange={(e) => setServerId(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-neko-panel/60 border border-neko-border/50 text-white font-light focus:border-neko-purple-light/50 focus:outline-none transition-all duration-300"
                >
                  {servers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name || s.host} ({s.username}@{s.host})
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-3">
              <AlertCircle size={20} className="text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-red-300 font-semibold text-sm">Error</p>
                <p className="text-red-200 text-sm mt-1 font-light">{error}</p>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader size={32} className="text-neko-purple-light animate-spin mx-auto mb-4" />
                <p className="text-slate-400 font-light">Loading metrics history...</p>
              </div>
            </div>
          )}

          {/* Charts */}
          {history.length > 0 && !loading && (
            <div className="space-y-6">
              {[
                { title: 'CPU Usage Over Time', key: 'cpu', stroke: '#3b82f6', name: 'CPU %' },
                { title: 'Memory Usage Over Time', key: 'mem_usage_percent', stroke: '#06b6d4', name: 'Memory %' },
                { title: 'Disk Usage Over Time', key: 'disk_usage_percent', stroke: '#f59e0b', name: 'Disk %' },
              ].map((chart) => {
                // Safely extract and convert values
                const values = history
                  .map(h => {
                    const val = h[chart.key]
                    return typeof val === 'number' ? val : parseFloat(val) || 0
                  })
                  .filter(v => !isNaN(v) && v >= 0)

                const latestValue = values.length > 0 ? values[values.length - 1] : 0
                const minValue = values.length > 0 ? Math.min(...values) : 0
                const maxValue = values.length > 0 ? Math.max(...values) : 0
                const avgValue = values.length > 0 ? (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2) : '0.00'

                return (
                  <div key={chart.key} className="group relative">
                    {/* Gradient Border Effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-neko-purple/20 to-neko-purple/5 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-500 pointer-events-none"></div>

                    {/* Chart Card */}
                    <div className="relative bg-gradient-to-br from-neko-panel/80 to-neko-panel/40 border border-neko-border/50 rounded-2xl p-8 hover:border-neko-purple-light/40 transition-all duration-300 backdrop-blur-sm">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                          <div className="w-1.5 h-6 bg-gradient-to-b from-neko-purple-light to-neko-purple rounded"></div>
                          {chart.title}
                        </h3>
                        <button
                          onClick={fetchHistory}
                          className="p-2 rounded-lg hover:bg-neko-purple/20 transition-all duration-300"
                        >
                          <RefreshCw size={18} className="text-neko-purple-light hover:text-white transition-colors" />
                        </button>
                      </div>

                      {/* Metrics Stats */}
                      <div className="grid grid-cols-4 gap-3 mb-6">
                        <div className="p-3 rounded-lg bg-neko-panel/50 border border-neko-border/30">
                          <p className="text-xs text-slate-500 font-light">Current</p>
                          <p className="text-lg font-bold text-neko-purple-light mt-1">{latestValue.toFixed(2)}%</p>
                        </div>
                        <div className="p-3 rounded-lg bg-neko-panel/50 border border-neko-border/30">
                          <p className="text-xs text-slate-500 font-light">Average</p>
                          <p className="text-lg font-bold text-blue-400 mt-1">{avgValue}%</p>
                        </div>
                        <div className="p-3 rounded-lg bg-neko-panel/50 border border-neko-border/30">
                          <p className="text-xs text-slate-500 font-light">Min</p>
                          <p className="text-lg font-bold text-emerald-400 mt-1">{minValue.toFixed(2)}%</p>
                        </div>
                        <div className="p-3 rounded-lg bg-neko-panel/50 border border-neko-border/30">
                          <p className="text-xs text-slate-500 font-light">Peak</p>
                          <p className="text-lg font-bold text-amber-400 mt-1">{maxValue.toFixed(2)}%</p>
                        </div>
                      </div>

                      <div className="bg-neko-panel/40 rounded-xl p-4 border border-neko-border/30">
                        <ResponsiveContainer width="100%" height={350}>
                          <LineChart data={history}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" opacity={0.5} />
                            <XAxis 
                              dataKey="timestamp" 
                              stroke="#94a3b8"
                              style={{ fontSize: '12px' }}
                              tick={{ fill: '#94a3b8' }}
                            />
                            <YAxis 
                              stroke="#94a3b8"
                              style={{ fontSize: '12px' }}
                              tick={{ fill: '#94a3b8' }}
                            />
                            <Tooltip 
                              contentStyle={{
                                backgroundColor: '#1a1a2e',
                                border: '1px solid rgba(168, 85, 247, 0.3)',
                                borderRadius: '8px',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)'
                              }}
                              labelStyle={{ color: '#fff' }}
                              formatter={(value) => typeof value === 'number' ? value.toFixed(2) : value}
                            />
                            <Legend wrapperStyle={{ paddingTop: '20px' }} />
                            <Line 
                              type="monotone" 
                              dataKey={chart.key} 
                              stroke={chart.stroke} 
                              name={chart.name} 
                              dot={false}
                              strokeWidth={3}
                              isAnimationActive={true}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Empty State */}
          {history.length === 0 && !loading && !error && !isLoadingServers && (
            <div className="text-center py-12">
              <BarChart3 size={48} className="text-slate-400 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-bold text-white mb-2">No history data available</h3>
              <p className="text-slate-400 font-light">Fetch metrics from the Servers page to record data.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
