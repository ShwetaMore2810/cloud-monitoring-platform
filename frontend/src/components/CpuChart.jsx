import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Cpu, ChevronDown } from 'lucide-react'
import { cpuHistory as mockCpuHistory } from '../data/mockData.js'

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-neko-panel border border-neko-border rounded-lg px-3 py-2 shadow-xl">
        <div className="text-neko-purple-light font-bold text-sm">{payload[0].value}%</div>
        <div className="text-slate-400 text-xs mt-0.5">{label}</div>
      </div>
    )
  }
  return null
}

export default function CpuChart() {
  const historyRaw = JSON.parse(localStorage.getItem('metricsHistory') || '[]')
  const history =
    historyRaw.length > 0
      ? historyRaw
          .slice(-24)
          .map((r) => ({
            time: new Date(r.collected_at || r.timestamp || Date.now()).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
            cpu: Number(r.cpu || 0),
          }))
      : mockCpuHistory

  return (
    <div className="bg-neko-panel border border-neko-border rounded-2xl p-5 shadow-card h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Cpu size={17} className="text-neko-purple-light" />
          <h2 className="text-white font-semibold text-base">CPU Usage (Recent)</h2>
        </div>
        <button className="flex items-center gap-1.5 bg-neko-panel-2 border border-neko-border rounded-lg px-3 py-1.5 text-xs text-slate-300 font-medium">
          Last Samples
          <ChevronDown size={14} />
        </button>
      </div>

      <ResponsiveContainer width="100%" height={330}>
        <AreaChart data={history} margin={{ top: 10, right: 10, left: -12, bottom: 0 }}>
          <defs>
            <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7c5cfc" stopOpacity={0.55} />
              <stop offset="100%" stopColor="#7c5cfc" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="#1f2937" />
          <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
          <YAxis axisLine={false} tickLine={false} domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="cpu"
            stroke="#8b6cfd"
            strokeWidth={2.5}
            fill="url(#cpuGradient)"
            dot={false}
            activeDot={{ r: 5, fill: '#8b6cfd', stroke: '#0a0e1a', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}