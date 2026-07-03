import { Link } from 'react-router-dom'
import { BarChart3, ArrowRight, Activity, AlertTriangle, CheckCircle } from 'lucide-react'

export default function DashboardPreview() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <div className="relative group">
        {/* Gradient Glow Background */}
        <div className="absolute -inset-1 bg-gradient-to-r from-neko-purple/30 to-neko-purple/10 rounded-3xl blur-2xl opacity-75 group-hover:opacity-100 transition duration-500"></div>

        {/* Main Card */}
        <div className="relative bg-gradient-to-br from-neko-panel/80 to-neko-panel/40 border border-neko-border/50 rounded-3xl p-10 md:p-12 hover:border-neko-purple-light/40 transition-all duration-300 overflow-hidden backdrop-blur-sm">
          
          {/* Background Pattern */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-neko-purple/5 rounded-full blur-3xl opacity-40 pointer-events-none"></div>
          
          {/* Header */}
          <div className="relative flex items-start justify-between mb-10">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-neko-purple/30 to-neko-purple/10 flex items-center justify-center group-hover:bg-neko-purple/40 transition-all duration-300 shadow-lg shadow-neko-purple/20 border border-neko-border/50">
                  <BarChart3 size={28} className="text-neko-purple-light" />
                </div>
                <div>
                  <h3 className="text-white font-black text-2xl">Operations Dashboard</h3>
                  <p className="text-slate-400 text-sm mt-1 font-light">View alerts, server status, and usage analytics in one screen.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="relative grid md:grid-cols-3 gap-4 mb-8">
            
            {/* CPU Metric */}
            <div className="group/metric p-6 rounded-xl bg-gradient-to-br from-neko-panel-2/80 to-neko-panel/40 border border-neko-border/40 hover:border-neko-purple-light/30 transition-all duration-300 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">CPU Usage</span>
                <Activity size={18} className="text-blue-400/70" />
              </div>
              <div className="text-4xl font-black text-white mb-2">34%</div>
              <div className="h-1.5 bg-neko-border/50 rounded-full overflow-hidden">
                <div className="h-full w-1/3 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"></div>
              </div>
            </div>

            {/* Memory Metric */}
            <div className="group/metric p-6 rounded-xl bg-gradient-to-br from-neko-panel-2/80 to-neko-panel/40 border border-neko-border/40 hover:border-neko-purple-light/30 transition-all duration-300 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Memory</span>
                <CheckCircle size={18} className="text-green-400/70" />
              </div>
              <div className="text-4xl font-black text-white mb-2">2.4 GB</div>
              <div className="h-1.5 bg-neko-border/50 rounded-full overflow-hidden">
                <div className="h-full w-1/2 bg-gradient-to-r from-green-500 to-green-400 rounded-full"></div>
              </div>
            </div>

            {/* Alerts Metric */}
            <div className="group/metric p-6 rounded-xl bg-gradient-to-br from-neko-panel-2/80 to-neko-panel/40 border border-neko-border/40 hover:border-neko-purple-light/30 transition-all duration-300 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Active Alerts</span>
                <AlertTriangle size={18} className="text-yellow-400/70" />
              </div>
              <div className="text-4xl font-black text-neko-purple-light mb-2">2</div>
              <div className="h-1.5 bg-neko-border/50 rounded-full overflow-hidden">
                <div className="h-full w-1/4 bg-gradient-to-r from-neko-purple to-neko-purple-light rounded-full"></div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="relative flex items-center justify-between pt-8 border-t border-neko-border/30">
            <p className="text-slate-400 text-sm font-light">Unified monitoring in a single dashboard</p>
            <Link 
              to="/operations" 
              className="inline-flex items-center gap-2 text-neko-purple-light hover:text-white font-semibold text-sm group/link transition-all duration-300 px-6 py-2.5 rounded-full hover:bg-neko-purple/20 border border-neko-purple-light/30 hover:border-neko-purple-light/60"
            >
              Open full dashboard
              <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
