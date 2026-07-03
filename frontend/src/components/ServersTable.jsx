import { Server, Circle, MoreVertical, Loader, Upload, RefreshCw, Trash2 } from 'lucide-react'
import { useState } from 'react'

const statusConfig = {
  Online: { dot: 'fill-emerald-400 text-emerald-400', text: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  Warning: { dot: 'fill-amber-400 text-amber-400', text: 'text-amber-400', bg: 'bg-amber-500/10' },
  Offline: { dot: 'fill-red-400 text-red-400', text: 'text-red-400', bg: 'bg-red-500/10' },
}

function UsageBar({ value, color }) {
  if (value === null || value === undefined) return <span className="text-slate-600 text-sm">-</span>
  return (
    <div className="flex items-center gap-2 min-w-[90px]">
      <span className="text-sm text-slate-200 font-medium w-9 shrink-0">{value}%</span>
      <div className="flex-1 h-1.5 rounded-full bg-neko-border overflow-hidden">
        <div className="h-full rounded-full transition-all duration-300" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
    </div>
  )
}

export default function ServersTable({ servers = [], onFetchMetrics, onDeleteServer, fetchingId, deletingId, pemFiles, onPickPem }) {
  const [openMenuId, setOpenMenuId] = useState(null)

  if (!servers || servers.length === 0) {
    return (
      <div className="group relative">
        {/* Gradient Border Effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-neko-purple/20 to-neko-purple/5 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-500 pointer-events-none"></div>

        {/* Empty State Card */}
        <div className="relative bg-gradient-to-br from-neko-panel/80 to-neko-panel/40 border border-neko-border/50 rounded-2xl p-12 text-center backdrop-blur-sm">
          <Server size={48} className="text-slate-400 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-bold text-white mb-2">No servers available</h3>
          <p className="text-slate-400 font-light">Add your first server above to get started with monitoring</p>
        </div>
      </div>
    )
  }

  return (
    <div className="group relative">
      {/* Gradient Border Effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-neko-purple/20 to-neko-purple/5 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-500 pointer-events-none"></div>

      {/* Table Card */}
      <div className="relative bg-gradient-to-br from-neko-panel/80 to-neko-panel/40 border border-neko-border/50 rounded-2xl p-6 shadow-card backdrop-blur-sm">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-6 border-b border-neko-border/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-neko-purple/20 flex items-center justify-center">
              <Server size={20} className="text-neko-purple-light" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">Connected Servers</h2>
              <p className="text-slate-400 text-xs font-light mt-1">{servers.length} server{servers.length !== 1 ? 's' : ''} configured</p>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-left min-w-[900px]">
            <thead>
              <tr className="text-xs uppercase tracking-wider text-slate-500 font-semibold border-b border-neko-border/20">
                <th className="pb-3 px-2">Server Name</th>
                <th className="pb-3 px-2">Connection</th>
                <th className="pb-3 px-2">Status</th>
                <th className="pb-3 px-2">CPU</th>
                <th className="pb-3 px-2">Memory</th>
                <th className="pb-3 px-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {servers.map((server) => {
                const hasPem = pemFiles[server.id]
                const isFetching = fetchingId === server.id
                const isDeleting = deletingId === server.id
                const menuOpen = openMenuId === server.id

                return (
                  <tr 
                    key={server.id} 
                    className="border-t border-neko-border/20 hover:bg-neko-purple/10 transition-colors duration-300 group/row"
                  >
                    {/* Server Name */}
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-neko-panel-2/60 border border-neko-border/30 flex items-center justify-center shrink-0 group-hover/row:border-neko-purple-light/40 transition-colors">
                          <Server size={16} className="text-neko-purple-light" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-white truncate">{server.name || server.host}</div>
                          <div className="text-xs text-slate-500 font-light">{server.host}</div>
                        </div>
                      </div>
                    </td>

                    {/* Connection Info */}
                    <td className="py-4 px-2">
                      <div className="text-sm text-slate-300 font-light">{server.username}@{server.host}</div>
                      <div className="text-xs text-slate-500 mt-1">{server.auth_type === 'pem' ? 'SSH Key' : 'Password'}</div>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-2">
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${statusConfig.Online.bg} border border-neko-border/30`}>
                        <Circle size={6} className={statusConfig.Online.dot} />
                        <span className={`text-xs font-semibold ${statusConfig.Online.text}`}>Ready</span>
                      </div>
                    </td>

                    {/* CPU Placeholder */}
                    <td className="py-4 px-2">
                      <UsageBar value={null} color="#3b82f6" />
                    </td>

                    {/* Memory Placeholder */}
                    <td className="py-4 px-2">
                      <UsageBar value={null} color="#06b6d4" />
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-2 text-right relative">
                      <div className="flex items-center justify-end gap-2">
                        {/* PEM File Input */}
                        <label className="relative group/input cursor-pointer">
                          <div className={`p-2 rounded-lg border transition-all duration-300 ${
                            hasPem 
                              ? 'bg-emerald-500/10 border-emerald-500/30 hover:border-emerald-500/60' 
                              : 'bg-neko-panel/60 border-neko-border/30 hover:border-neko-purple-light/40'
                          }`}>
                            <Upload className={`w-4 h-4 ${hasPem ? 'text-emerald-400' : 'text-slate-400'}`} />
                          </div>
                          <input
                            type="file"
                            accept=".pem"
                            onChange={(e) => onPickPem(server.id, e.target.files?.[0])}
                            className="hidden"
                            title={hasPem ? `${pemFiles[server.id].name} selected` : 'Select .pem file'}
                          />
                          <div className="absolute bottom-full right-0 mb-2 px-2 py-1 rounded bg-slate-900 text-xs text-slate-200 whitespace-nowrap opacity-0 group-hover/input:opacity-100 transition-opacity pointer-events-none z-10">
                            {hasPem ? pemFiles[server.id].name : 'Select .pem'}
                          </div>
                        </label>

                        {/* Fetch Metrics Button */}
                        <button
                          onClick={() => onFetchMetrics(server.id)}
                          disabled={!hasPem || isFetching}
                          className={`p-2 rounded-lg transition-all duration-300 flex items-center gap-1.5 ${
                            !hasPem || isFetching
                              ? 'opacity-50 cursor-not-allowed'
                              : 'bg-gradient-to-r from-neko-purple to-neko-purple-light text-white hover:shadow-lg hover:shadow-neko-purple/50'
                          }`}
                          title={!hasPem ? 'Select .pem file first' : 'Fetch metrics'}
                        >
                          {isFetching ? (
                            <Loader size={14} className="animate-spin" />
                          ) : (
                            <RefreshCw size={14} />
                          )}
                        </button>

                        {/* Menu Button */}
                        <div className="relative group/menu">
                          <button 
                            onClick={() => setOpenMenuId(menuOpen ? null : server.id)}
                            className="p-2 rounded-lg text-slate-400 hover:text-neko-purple-light hover:bg-neko-purple/20 transition-all duration-300 relative z-10"
                          >
                            <MoreVertical size={16} />
                          </button>

                          {/* Dropdown Menu */}
                          {menuOpen && (
                            <div className="absolute right-0 top-full mt-2 bg-gradient-to-br from-neko-panel to-neko-panel-2 border border-neko-border rounded-lg shadow-xl z-20 min-w-[160px] overflow-hidden">
                              <button
                                onClick={() => {
                                  onDeleteServer(server.id)
                                  setOpenMenuId(null)
                                }}
                                disabled={isDeleting}
                                className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/20 transition-all duration-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed border-b border-neko-border/30 last:border-b-0"
                              >
                                {isDeleting ? (
                                  <>
                                    <Loader size={16} className="animate-spin" />
                                    Deleting...
                                  </>
                                ) : (
                                  <>
                                    <Trash2 size={16} />
                                    Delete Server
                                  </>
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Footer Info */}
        <div className="mt-6 pt-6 border-t border-neko-border/20 flex items-center justify-between text-xs text-slate-500 font-light">
          <span>Showing {servers.length} server{servers.length !== 1 ? 's' : ''}</span>
          <span>Select .pem file and click refresh to fetch metrics</span>
        </div>
      </div>
    </div>
  )
}
