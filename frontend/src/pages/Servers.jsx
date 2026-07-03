import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import AddServer from '../components/AddServer.jsx'
import ServersTable from '../components/ServersTable.jsx'
import { Server, RefreshCw, AlertCircle, Loader } from 'lucide-react'


export default function Servers() {
  const [servers, setServers] = useState([])
  const [error, setError] = useState(null)
  const [successMsg, setSuccessMsg] = useState(null)
  const [fetchingId, setFetchingId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [pemFiles, setPemFiles] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  const loadServers = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await api.get('/servers')
      const list = res.data?.servers || []
      
      // Only show real servers from API, no mock data
      setServers(list)
      
      if (list.length > 0) {
        localStorage.setItem('serversCache', JSON.stringify(list))
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setError('⚠️ Authentication failed. Please configure your backend authentication.')
      } else if (err.response?.status === 404) {
        // No servers yet, that's okay
        setServers([])
      } else {
        setError(err.response?.data?.error || 'Failed to load servers')
      }
      console.error('Error loading servers:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadServers()
  }, [])

  // Clear success message after 3 seconds
  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [successMsg])

  const onPickPem = (serverId, file) => {
    setPemFiles((prev) => ({ ...prev, [serverId]: file || null }))
  }

  const fetchMetricsNow = async (serverId) => {
    const pem = pemFiles[serverId]
    if (!pem) {
      setError('Please select a .pem file for this server before fetching metrics.')
      return
    }

    setFetchingId(serverId)
    setError(null)

    try {
      // 1) fetch latest metrics
      const fd = new FormData()
      fd.append('pem', pem)

      const res = await api.post(`/metrics/fetch/${serverId}`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      if (res.data?.metrics) {
        localStorage.setItem('latestMetrics', JSON.stringify(res.data.metrics))
      }
      if (res.data?.server) {
        localStorage.setItem('selectedServer', JSON.stringify(res.data.server))
      }

      // 2) fetch recent history for charts
      const hist = await api.get(`/metrics/history/${serverId}?limit=50`)
      localStorage.setItem('metricsHistory', JSON.stringify(hist.data?.history || []))

      await loadServers()
      navigate('/operations')
    } catch (err) {
      if (err.response?.status === 401) {
        setError('⚠️ Authentication failed. Please check your credentials.')
      } else {
        setError(err.response?.data?.error || 'Failed to fetch metrics')
      }
      console.error('Error fetching metrics:', err)
    } finally {
      setFetchingId(null)
    }
  }

  const deleteServer = async (serverId) => {
    if (!window.confirm('Are you sure you want to delete this server? This action cannot be undone.')) {
      return
    }

    setDeletingId(serverId)
    setError(null)
    
    try {
      await api.delete(`/servers/${serverId}`)
      setSuccessMsg('Server deleted successfully')
      await loadServers()
      setPemFiles((prev) => {
        const newPemFiles = { ...prev }
        delete newPemFiles[serverId]
        return newPemFiles
      })
    } catch (err) {
      if (err.response?.status === 401) {
        setError('⚠️ Authentication failed. Please check your credentials.')
      } else {
        setError(err.response?.data?.error || 'Failed to delete server')
      }
      console.error('Error deleting server:', err)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#1a1a2e] to-[#0f0f1f]">
      {/* Background Pattern */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-neko-purple/5 to-transparent opacity-30"></div>
        <div className="absolute top-0 -left-40 w-80 h-80 bg-neko-purple/8 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
        <div className="absolute top-40 -right-40 w-80 h-80 bg-neko-purple/8 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animation-delay-2000 animate-blob"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-neko-purple/20 flex items-center justify-center">
              <Server size={28} className="text-neko-purple-light" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-white">Servers</h1>
              <p className="text-slate-400 font-light text-sm mt-1">Manage and fetch metrics from your infrastructure</p>
            </div>
          </div>

          <button
            onClick={loadServers}
            disabled={isLoading}
            className="px-4 py-2.5 rounded-lg border border-neko-border/50 text-slate-300 hover:text-neko-purple-light transition-all duration-300 hover:bg-neko-purple/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
            {isLoading ? 'Loading...' : 'Refresh'}
          </button>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="mb-6 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3 animate-fadeInUp">
            <svg className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-emerald-300 font-light">{successMsg}</p>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-3 animate-fadeInUp">
            <AlertCircle size={20} className="text-red-400 mt-0.5 flex-shrink-0" />
            <p className="text-red-300 font-light">{error}</p>
          </div>
        )}

        {/* Add Server Form */}
        <div className="mb-8">
          <AddServer onCreated={loadServers} />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader size={32} className="text-neko-purple-light animate-spin mx-auto mb-4" />
              <p className="text-slate-400 font-light">Loading servers...</p>
            </div>
          </div>
        )}

        {/* Servers Table - Shows only real data */}
        {!isLoading && (
          <ServersTable 
            servers={servers}
            onFetchMetrics={fetchMetricsNow}
            onDeleteServer={deleteServer}
            fetchingId={fetchingId}
            deletingId={deletingId}
            pemFiles={pemFiles}
            onPickPem={onPickPem}
          />
        )}
      </div>
    </div>
  )
}
