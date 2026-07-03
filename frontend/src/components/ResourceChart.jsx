import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { PieChart as PieIcon } from 'lucide-react'
import { resourceUsage as mockResourceUsage, totalResourceUsage as mockTotal } from '../data/mockData.js'

export default function ResourceChart() {
  const latest = JSON.parse(localStorage.getItem('latestMetrics') || 'null')

  const resourceUsage = latest
    ? [
        { name: 'CPU', value: Number(latest.cpu || 0), color: '#8b6cfd' },
        { name: 'Memory', value: Number(latest.mem_usage_percent || 0), color: '#3b82f6' },
        { name: 'Disk', value: Number(latest.disk_usage_percent || 0), color: '#f59e0b' },
      ]
    : mockResourceUsage

  const totalResourceUsage =
    latest
      ? Math.round(
          (Number(latest.cpu || 0) + Number(latest.mem_usage_percent || 0) + Number(latest.disk_usage_percent || 0)) / 3
        )
      : mockTotal

  return (
    <div className="bg-neko-panel border border-neko-border rounded-2xl p-5 shadow-card h-full flex flex-col">
      <div className="flex items-center gap-2 mb-2">
        <PieIcon size={17} className="text-neko-purple-light" />
        <h2 className="text-white font-semibold text-base">Resource Usage</h2>
      </div>

      <div className="relative flex-1 min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={resourceUsage}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius="62%"
              outerRadius="90%"
              paddingAngle={3}
              startAngle={90}
              endAngle={450}
              stroke="none"
            >
              {resourceUsage.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-slate-400 text-xs">Avg Usage</span>
          <span className="text-white text-3xl font-extrabold mt-0.5">{totalResourceUsage}%</span>
        </div>
      </div>

      <div className="space-y-2.5 mt-2">
        {resourceUsage.map((item) => (
          <div key={item.name} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-slate-300">{item.name}</span>
            </div>
            <span className="text-white font-semibold">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}