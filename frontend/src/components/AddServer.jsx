import { useState } from 'react'
import api from '../api'
import { Plus, AlertCircle, CheckCircle, Loader } from 'lucide-react'

export default function AddServer({ onCreated }) {
  const [name, setName] = useState('')
  const [host, setHost] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!host || !username) {
      setError('Host and username are required')
      return
    }

    setLoading(true)
    try {
      const resp = await api.post('/servers', {
        name: name || null,
        host,
        username,
        auth_type: 'pem',
      })

      setSuccess(`Server "${resp.data.server.name || resp.data.server.host}" added successfully!`)
      onCreated?.(resp.data.server)
      setName('')
      setHost('')
      setUsername('')

      setTimeout(() => {
        setSuccess(null)
        setIsOpen(false)
      }, 2000)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Collapse/Expand Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full group relative mb-4"
      >
        {/* Gradient Border Effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-neko-purple/20 to-neko-purple/5 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-500 pointer-events-none"></div>

        {/* Button Content */}
        <div className="relative bg-gradient-to-br from-neko-panel/80 to-neko-panel/40 border border-neko-border/50 rounded-2xl p-4 hover:border-neko-purple-light/40 transition-all duration-300 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-neko-purple/20 flex items-center justify-center group-hover:bg-neko-purple/30 transition-all">
              <Plus size={20} className="text-neko-purple-light" />
            </div>
            <div className="text-left">
              <h3 className="text-white font-bold text-lg">Add New Server</h3>
              <p className="text-slate-400 text-sm font-light">{isOpen ? 'Configure your server details' : 'Click to add a new server'}</p>
            </div>
          </div>
          <div className={`text-neko-purple-light transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}>
            <Plus size={20} />
          </div>
        </div>
      </button>

      {/* Form */}
      {isOpen && (
        <div className="group relative mb-4">
          {/* Gradient Border Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-neko-purple/20 to-neko-purple/5 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-500 pointer-events-none"></div>

          <form onSubmit={submit} className="relative bg-gradient-to-br from-neko-panel/80 to-neko-panel/40 border border-neko-border/50 rounded-2xl p-6 space-y-4 backdrop-blur-sm">
            
            {/* Error Alert */}
            {error && (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-3">
                <AlertCircle size={18} className="text-red-400 mt-0.5 flex-shrink-0" />
                <p className="text-red-300 text-sm font-light">{error}</p>
              </div>
            )}

            {/* Success Alert */}
            {success && (
              <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3 animate-fadeInUp">
                <CheckCircle size={18} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                <p className="text-emerald-300 text-sm font-light">{success}</p>
              </div>
            )}

            {/* Form Fields */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Server Name */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-2">
                  Server Name (Optional)
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Production Server"
                  className="w-full px-4 py-2.5 rounded-lg bg-neko-panel/60 border border-neko-border/50 text-white placeholder-slate-500 focus:border-neko-purple-light/50 focus:outline-none transition-all duration-300 font-light"
                />
              </div>

              {/* Host */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-2">
                  Host Address
                </label>
                <input
                  value={host}
                  onChange={(e) => setHost(e.target.value)}
                  placeholder="192.168.1.100 or example.com"
                  required
                  className="w-full px-4 py-2.5 rounded-lg bg-neko-panel/60 border border-neko-border/50 text-white placeholder-slate-500 focus:border-neko-purple-light/50 focus:outline-none transition-all duration-300 font-light"
                />
              </div>

              {/* Username */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-2">
                  SSH Username
                </label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="ubuntu, ec2-user, etc."
                  required
                  className="w-full px-4 py-2.5 rounded-lg bg-neko-panel/60 border border-neko-border/50 text-white placeholder-slate-500 focus:border-neko-purple-light/50 focus:outline-none transition-all duration-300 font-light"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-r from-neko-purple to-neko-purple-light text-white font-semibold hover:shadow-lg hover:shadow-neko-purple/50 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Plus size={16} />
                    Save Server
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false)
                  setError(null)
                  setSuccess(null)
                }}
                className="px-6 py-2.5 rounded-lg border border-neko-border/50 text-slate-300 hover:text-neko-purple-light transition-all duration-300 hover:bg-neko-purple/20 font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
