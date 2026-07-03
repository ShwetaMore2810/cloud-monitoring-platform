import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { Activity, TrendingUp, HardDrive, Power, RefreshCw } from 'lucide-react'
import Header from '../components/Header.jsx'
import { useState, useEffect } from 'react'

export default function Dashboard() {
  const [refreshInterval, setRefreshInterval] = useState(null)
  const [lastRefresh, setLastRefresh] = useState(null)

  const latest = JSON.parse(localStorage.getItem('latestMetrics') || 'null')
  const selectedServer = JSON.parse(localStorage.getItem('selectedServer') || 'null')
  const historyRaw = JSON.parse(localStorage.getItem('metricsHistory') || '[]')

  // Build chart dataset
  let chartData = historyRaw.map((r, idx) => ({
    time: new Date(r.collected_at || Date.now() + idx * 1000).toLocaleTimeString(),
    cpu: Number(r.cpu ?? 0),
    mem: Number(r.mem_usage_percent ?? 0),
    disk: Number(r.disk_usage_percent ?? 0),
  }))

  // fallback so charts are visible immediately after first fetch
  if (!chartData.length && latest) {
    chartData = [
      {
        time: new Date().toLocaleTimeString(),
        cpu: Number(latest.cpu || 0),
        mem: Number(latest.mem_usage_percent || 0),
        disk: Number(latest.disk_usage_percent || 0),
      },
    ]
  }

  const pieData = latest
    ? [
        { name: 'CPU', value: Number(latest.cpu || 0), color: '#8b5cf6' },
        { name: 'Memory', value: Number(latest.mem_usage_percent || 0), color: '#3b82f6' },
        { name: 'Disk', value: Number(latest.disk_usage_percent || 0), color: '#f59e0b' },
      ]
    : []

  // Helper function to get metric status color
  const getMetricStatus = (value, threshold = 80) => {
    if (value >= threshold) return 'text-red-400'
    if (value >= 60) return 'text-yellow-400'
    return 'text-emerald-400'
  }

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      // Refresh data from localStorage (in a real app, this would fetch from API)
      const updatedLatest = JSON.parse(localStorage.getItem('latestMetrics') || 'null')
      const updatedHistory = JSON.parse(localStorage.getItem('metricsHistory') || '[]')
      
      // Trigger re-render by updating state
      setLastRefresh(new Date().toLocaleTimeString())
      
      // In a real implementation, you'd fetch from API here
      // For now, we just update the display
      window.dispatchEvent(new CustomEvent('metricsUpdated', { detail: { updatedLatest, updatedHistory } }))
    }, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [])

  const handleRefreshNow = () => {
    setLastRefresh(new Date().toLocaleTimeString())
    // In a real app, fetch from API here
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#1a1a2e] to-[#0f0f1f]">
      {/* Background Pattern */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-neko-purple/5 to-transparent opacity-30"></div>
        <div className="absolute top-0 -left-40 w-80 h-80 bg-neko-purple/8 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
        <div className="absolute top-40 -right-40 w-80 h-80 bg-neko-purple/8 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animation-delay-2000 animate-blob"></div>
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto">
        <Header />

        {/* Live Server Metrics Header */}
        <div className="mx-6 mt-8 mb-8">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-neko-purple/20 to-neko-purple/5 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-500"></div>
            
            <div className="relative bg-gradient-to-br from-neko-panel/80 to-neko-panel/40 border border-neko-border/50 rounded-3xl p-8 hover:border-neko-purple-light/40 transition-all duration-300 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-neko-purple/20 flex items-center justify-center">
                    <Activity size={24} className="text-neko-purple-light" />
                  </div>
                  <h2 className="text-white text-2xl font-black">Live Server Metrics</h2>
                </div>

                {/* Auto Refresh Status */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleRefreshNow}
                    className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-neko-purple to-neko-purple-light text-white font-semibold hover:shadow-lg hover:shadow-neko-purple/50 transition-all duration-300 flex items-center gap-2"
                  >
                    <RefreshCw size={16} />
                    Refresh Now
                  </button>
                  <div className="text-sm text-slate-400">
                    <p className="font-light">Auto refresh: <span className="text-neko-purple-light font-semibold">30s</span></p>
                    {lastRefresh && <p className="text-xs text-slate-500 mt-1">Last: {lastRefresh}</p>}
                  </div>
                </div>
              </div>
              
              {selectedServer && (
                <p className="text-slate-400 text-sm ml-13 font-light mb-6">
                  <span className="font-semibold text-neko-purple-light">{selectedServer.name || selectedServer.host}</span>
                  <span className="mx-2 text-slate-500">•</span>
                  <span>{selectedServer.username}@{selectedServer.host}</span>
                </p>
              )}

              {!latest ? (
                <div className="mt-6 p-6 rounded-xl bg-neko-purple/10 border border-neko-purple/20">
                  <p className="text-slate-400 font-light">No metrics yet. Go to Servers → Fetch Metrics.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* CPU Card */}
                  <div className="group relative p-6 rounded-2xl border border-neko-border/50 bg-gradient-to-br from-neko-panel/60 to-neko-panel/20 hover:border-neko-purple-light/40 transition-all duration-300 hover:bg-neko-panel/70 hover:shadow-lg hover:shadow-neko-purple/20 hover:-translate-y-1 cursor-pointer">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">CPU</span>
                      <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                        <TrendingUp size={16} className="text-blue-400" />
                      </div>
                    </div>
                    <div className="flex items-end justify-between">
                      <div>
                        <p className={`text-4xl font-black ${getMetricStatus(latest.cpu)}`}>{latest.cpu}%</p>
                        <p className="text-xs text-slate-500 mt-1">CPU Usage</p>
                      </div>
                    </div>
                    <div className="mt-4 h-1.5 bg-neko-border/50 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(latest.cpu, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Memory Card */}
                  <div className="group relative p-6 rounded-2xl border border-neko-border/50 bg-gradient-to-br from-neko-panel/60 to-neko-panel/20 hover:border-neko-purple-light/40 transition-all duration-300 hover:bg-neko-panel/70 hover:shadow-lg hover:shadow-neko-purple/20 hover:-translate-y-1 cursor-pointer">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Memory</span>
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                        <Activity size={16} className="text-cyan-400" />
                      </div>
                    </div>
                    <div className="flex items-end justify-between">
                      <div>
                        <p className={`text-4xl font-black ${getMetricStatus(latest.mem_usage_percent)}`}>{latest.mem_usage_percent}%</p>
                        <p className="text-xs text-slate-500 mt-1">Memory Usage</p>
                      </div>
                    </div>
                    <div className="mt-4 h-1.5 bg-neko-border/50 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(latest.mem_usage_percent, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Disk Card */}
                  <div className="group relative p-6 rounded-2xl border border-neko-border/50 bg-gradient-to-br from-neko-panel/60 to-neko-panel/20 hover:border-neko-purple-light/40 transition-all duration-300 hover:bg-neko-panel/70 hover:shadow-lg hover:shadow-neko-purple/20 hover:-translate-y-1 cursor-pointer">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Disk</span>
                      <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                        <HardDrive size={16} className="text-amber-400" />
                      </div>
                    </div>
                    <div className="flex items-end justify-between">
                      <div>
                        <p className={`text-4xl font-black ${getMetricStatus(latest.disk_usage_percent)}`}>{latest.disk_usage_percent}%</p>
                        <p className="text-xs text-slate-500 mt-1">Disk Usage</p>
                      </div>
                    </div>
                    <div className="mt-4 h-1.5 bg-neko-border/50 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(latest.disk_usage_percent, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Status Card */}
                  <div className="group relative p-6 rounded-2xl border border-neko-border/50 bg-gradient-to-br from-neko-panel/60 to-neko-panel/20 hover:border-neko-purple-light/40 transition-all duration-300 hover:bg-neko-panel/70 hover:shadow-lg hover:shadow-neko-purple/20 hover:-translate-y-1 cursor-pointer">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Status</span>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${latest.is_up ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                        <Power size={16} className={latest.is_up ? 'text-emerald-400' : 'text-red-400'} />
                      </div>
                    </div>
                    <div className="flex items-end justify-between">
                      <div>
                        <p className={`text-4xl font-black ${latest.is_up ? 'text-emerald-400' : 'text-red-400'}`}>
                          {latest.is_up ? 'UP' : 'DOWN'}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">Server Status</p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${latest.is_up ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`}></div>
                      <span className="text-xs text-slate-400">{latest.is_up ? 'Online' : 'Offline'}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Charts Section */}
        {chartData.length > 0 && (
          <div className="mx-6 mb-8">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Line Chart */}
              <div className="xl:col-span-2 group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-neko-purple/20 to-neko-purple/5 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-500"></div>
                
                <div className="relative bg-gradient-to-br from-neko-panel/80 to-neko-panel/40 border border-neko-border/50 rounded-3xl p-8 hover:border-neko-purple-light/40 transition-all duration-300 backdrop-blur-sm">
                  <h3 className="text-white text-xl font-black mb-6 flex items-center gap-2">
                    <div className="w-1.5 h-6 bg-gradient-to-b from-neko-purple-light to-neko-purple rounded"></div>
                    CPU / Memory / Disk Over Time
                  </h3>
                  <div className="bg-neko-panel/40 rounded-2xl p-4 border border-neko-border/30">
                    <ResponsiveContainer width="100%" height={320}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" opacity={0.5} />
                        <XAxis 
                          dataKey="time" 
                          stroke="#94a3b8" 
                          style={{ fontSize: '12px' }}
                          tick={{ fill: '#94a3b8' }}
                        />
                        <YAxis 
                          domain={[0, 100]} 
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
                        />
                        <Legend 
                          wrapperStyle={{ paddingTop: '20px' }}
                          iconType="line"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="cpu" 
                          stroke="#3b82f6" 
                          strokeWidth={3} 
                          dot={false}
                          name="CPU %" 
                          isAnimationActive={true}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="mem" 
                          stroke="#06b6d4" 
                          strokeWidth={3} 
                          dot={false}
                          name="Memory %" 
                          isAnimationActive={true}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="disk" 
                          stroke="#f59e0b" 
                          strokeWidth={3} 
                          dot={false}
                          name="Disk %" 
                          isAnimationActive={true}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Pie Chart */}
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-neko-purple/20 to-neko-purple/5 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-500"></div>
                
                <div className="relative bg-gradient-to-br from-neko-panel/80 to-neko-panel/40 border border-neko-border/50 rounded-3xl p-8 hover:border-neko-purple-light/40 transition-all duration-300 backdrop-blur-sm h-full">
                  <h3 className="text-white text-xl font-black mb-6 flex items-center gap-2">
                    <div className="w-1.5 h-6 bg-gradient-to-b from-neko-purple-light to-neko-purple rounded"></div>
                    Current Resource Split
                  </h3>
                  <div className="bg-neko-panel/40 rounded-2xl p-4 border border-neko-border/30 mb-6">
                    <ResponsiveContainer width="100%" height={260}>
                      <PieChart>
                        <Pie 
                          data={pieData} 
                          dataKey="value" 
                          nameKey="name" 
                          cx="50%" 
                          cy="50%" 
                          innerRadius={60} 
                          outerRadius={90}
                          isAnimationActive={true}
                        >
                          {pieData.map((entry) => (
                            <Cell key={entry.name} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: '#1a1a2e',
                            border: '1px solid rgba(168, 85, 247, 0.3)',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)'
                          }}
                          labelStyle={{ color: '#fff' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  {/* Legend */}
                  <div className="space-y-3">
                    {pieData.map((p) => (
                      <div key={p.name} className="flex items-center justify-between p-3 rounded-lg bg-neko-panel/50 border border-neko-border/30 hover:border-neko-purple-light/40 transition-all duration-300">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-3 h-3 rounded-full transition-transform duration-300"
                            style={{ backgroundColor: p.color }}
                          ></div>
                          <span className="text-slate-300 text-sm font-semibold">{p.name}</span>
                        </div>
                        <span className={`text-lg font-black ${p.color === '#8b5cf6' ? 'text-neko-purple-light' : p.color === '#3b82f6' ? 'text-blue-400' : 'text-amber-400'}`}>
                          {p.value}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
