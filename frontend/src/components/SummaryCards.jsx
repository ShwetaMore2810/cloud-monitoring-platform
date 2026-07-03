import { Server, Activity, ShieldAlert, Cpu, ArrowUp, ArrowDown } from 'lucide-react'
import { summaryStats as mockSummary } from '../data/mockData.js'

function cardTrend(value, baseline = 60) {
  if (value == null) return { trend: 'up', change: '+0%', changeLabel: 'no data' }
  const diff = value - baseline
  const up = diff >= 0
  return {
    trend: up ? 'up' : 'down',
    change: `${up ? '+' : ''}${diff.toFixed(1)}%`,
    changeLabel: 'vs baseline',
  }
}

export default function SummaryCards() {
  const latest = JSON.parse(localStorage.getItem('latestMetrics') || 'null')
  const serversCache = JSON.parse(localStorage.getItem('serversCache') || '[]')
  const alertsCache = JSON.parse(localStorage.getItem('alertsCache') || '[]')

  const totalServers = serversCache.length || Number(mockSummary.totalServers.value) || 0
  const online = serversCache.filter((s) => s.is_up).length || Number(mockSummary.online.value) || 0
  const criticalAlerts =
    alertsCache.filter((a) => a?.severity === 'critical').length || Number(mockSummary.criticalAlerts.value) || 0
  const fallbackCpu = parseFloat(String(mockSummary.averageCpu.value).replace('%', ''))
  const averageCpu = latest?.cpu ?? (Number.isNaN(fallbackCpu) ? 0 : fallbackCpu)
  
  const cards = [
    {
      key: 'totalServers',
      label: 'Total Servers',
      icon: Server,
      iconBg: 'bg-neko-purple/15',
      iconColor: 'text-neko-purple-light',
      value: totalServers,
      trend: { trend: 'up', change: '+0', changeLabel: 'latest' },
    },
    {
      key: 'online',
      label: 'Online',
      icon: Activity,
      iconBg: 'bg-emerald-500/15',
      iconColor: 'text-emerald-400',
      value: online,
      trend: { trend: 'up', change: '+0', changeLabel: 'latest' },
    },
    {
      key: 'criticalAlerts',
      label: 'Critical Alerts',
      icon: ShieldAlert,
      iconBg: 'bg-red-500/15',
      iconColor: 'text-red-400',
      value: criticalAlerts,
      trend: { trend: 'up', change: '+0', changeLabel: 'latest' },
    },
    {
      key: 'averageCpu',
      label: 'Average CPU',
      icon: Cpu,
      iconBg: 'bg-blue-500/15',
      iconColor: 'text-blue-400',
      value: `${averageCpu.toFixed(1)}%`,
      trend: cardTrend(averageCpu, 60),
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map(({ key, label, icon: Icon, iconBg, iconColor, value, trend }) => {
        const TrendIcon = trend.trend === 'up' ? ArrowUp : ArrowDown
        const trendColor =
          trend.trend === 'up'
            ? key === 'criticalAlerts'
              ? 'text-red-400'
              : 'text-emerald-400'
            : 'text-emerald-400'

        return (
          <div key={key} className="bg-neko-panel border border-neko-border rounded-2xl p-5 shadow-card">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg} ${iconColor}`}>
                <Icon size={20} strokeWidth={2} />
              </div>
              <span className="text-slate-300 text-sm font-medium">{label}</span>
            </div>
            <div className="text-3xl font-extrabold text-white mb-1.5">{value}</div>
            <div className={`flex items-center gap-1 text-xs font-medium ${trendColor}`}>
              <TrendIcon size={12} strokeWidth={2.5} />
              <span>{trend.change}</span>
              <span className="text-slate-500 font-normal">{trend.changeLabel}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}