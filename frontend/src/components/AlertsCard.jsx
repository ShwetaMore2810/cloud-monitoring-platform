import { Bell, AlertCircle, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { recentAlerts } from '../data/mockData.js'

const severityConfig = {
  critical: {
    icon: AlertCircle,
    iconColor: 'text-red-400',
    iconBg: 'bg-red-500/15',
    badge: 'bg-red-500/15 text-red-400 border border-red-500/30',
  },
  warning: {
    icon: AlertTriangle,
    iconColor: 'text-amber-400',
    iconBg: 'bg-amber-500/15',
    badge: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
  },
  info: {
    icon: CheckCircle2,
    iconColor: 'text-emerald-400',
    iconBg: 'bg-emerald-500/15',
    badge: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
  },
}

export default function AlertsCard() {
  return (
    <div className="bg-neko-panel border border-neko-border rounded-2xl p-5 shadow-card h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell size={17} className="text-neko-purple-light" />
          <h2 className="text-white font-semibold text-base">Recent Alerts</h2>
        </div>
        <button className="bg-neko-panel-2 border border-neko-border rounded-lg px-3 py-1.5 text-xs text-slate-300 font-medium hover:border-slate-600 transition-colors">
          View All Alerts
        </button>
      </div>

      <div className="space-y-1">
        {recentAlerts.map((alert) => {
          const cfg = severityConfig[alert.severity]
          const Icon = cfg.icon
          return (
            <div key={alert.id} className="flex items-start gap-3 py-3 border-b border-neko-border last:border-b-0">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${cfg.iconBg} ${cfg.iconColor}`}>
                <Icon size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-slate-100">{alert.title}</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${cfg.badge}`}>
                    {alert.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{alert.description}</p>
              </div>
              <span className="text-xs text-slate-500 shrink-0 whitespace-nowrap">{alert.time}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}