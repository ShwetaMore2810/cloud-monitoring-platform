import { ShieldCheck, BellRing, Activity, TrendingUp, Clock, AlertCircle } from 'lucide-react'

const items = [
  { 
    icon: Activity, 
    title: 'Live Metrics', 
    desc: 'Track CPU, memory, and service status continuously in real-time.'
  },
  { 
    icon: BellRing, 
    title: 'Smart Alerts', 
    desc: 'Get severity-based alerts with fast troubleshooting context.'
  },
  { 
    icon: ShieldCheck, 
    title: 'Operational Confidence', 
    desc: 'Centralized visibility helps reduce downtime risk significantly.'
  },
  { 
    icon: TrendingUp, 
    title: 'Performance Analytics', 
    desc: 'Deep insights into system performance with trend analysis.'
  },
  { 
    icon: Clock, 
    title: 'Historical Data', 
    desc: 'Access complete monitoring history for audit and analysis.'
  },
  { 
    icon: AlertCircle, 
    title: 'Predictive Alerts', 
    desc: 'Get notified before issues happen with ML-powered predictions.'
  }
]

export default function Features() {
  return (
    <section id="features" className="max-w-7xl mx-auto px-6 py-24 relative">
      {/* Section Header */}
      <div className="text-center mb-20">
        <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
          Why teams choose <span className="text-neko-purple-light">Neko Monitor</span>
        </h2>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto font-light">
          Powerful features designed to make infrastructure monitoring effortless and effective
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(({ icon: Icon, title, desc }, idx) => (
          <div 
            key={title} 
            className="group relative p-8 rounded-2xl border border-neko-border/50 bg-gradient-to-br from-neko-panel/40 to-neko-panel/20 hover:border-neko-purple-light/40 transition-all duration-300 hover:bg-neko-panel/60 hover:shadow-xl hover:shadow-neko-purple/15 hover:-translate-y-2 backdrop-blur-sm overflow-hidden"
          >
            {/* Background Gradient on Hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-neko-purple/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"></div>

            {/* Icon Container */}
            <div className="relative w-14 h-14 rounded-xl bg-neko-purple/20 text-neko-purple-light flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-neko-purple/30 transition-all duration-300 shadow-lg shadow-neko-purple/20 group-hover:shadow-lg group-hover:shadow-neko-purple/40">
              <Icon size={28} />
            </div>

            {/* Content */}
            <h3 className="relative text-white font-bold text-xl mb-3 group-hover:text-neko-purple-light transition-colors duration-300">{title}</h3>
            <p className="relative text-slate-400 text-sm leading-relaxed group-hover:text-slate-300 transition-colors duration-300 font-light">{desc}</p>

            {/* Bottom Border Line */}
            <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-neko-purple-light to-transparent group-hover:w-full transition-all duration-500"></div>
          </div>
        ))}
      </div>
    </section>
  )
}
