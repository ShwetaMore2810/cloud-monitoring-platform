import { useEffect, useState } from 'react'
import { Circle, CalendarDays, RefreshCw, Bell } from 'lucide-react'

function formatDateTime(date) {
  const datePart = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  const timePart = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
  return `${datePart}, ${timePart}`
}

export default function Header() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Operations Center</h1>
        <p className="text-slate-400 text-sm mt-1">Monitor your infrastructure in real-time.</p>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-sm">
        <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
          <Circle size={9} className="fill-emerald-400 text-emerald-400" />
          All Systems Operational
        </div>

        <div className="flex items-center gap-2 bg-neko-panel border border-neko-border rounded-lg px-3 py-1.5 text-slate-300">
          <CalendarDays size={15} className="text-slate-500" />
          {formatDateTime(now)}
        </div>

        <div className="flex items-center gap-2 bg-neko-panel border border-neko-border rounded-lg px-3 py-1.5 text-slate-300">
          <RefreshCw size={15} className="text-slate-500" />
          Auto refresh: <span className="text-neko-purple-light font-semibold">30s</span>
        </div>

        <button className="relative w-9 h-9 flex items-center justify-center bg-neko-panel border border-neko-border rounded-lg text-slate-400 hover:text-white transition-colors">
          <Bell size={16} />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-neko-bg" />
        </button>
      </div>
    </div>
  )
}