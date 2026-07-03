import { Link } from 'react-router-dom'
import { ArrowRight, Zap } from 'lucide-react'

export default function Hero() {
  const stats = [
    { label: 'Uptime SLA', value: '99.99%' },
    { label: 'Alert latency', value: '<50ms' },
    { label: 'Metrics/sec', value: '12k+' },
    { label: 'Observability', value: '24/7' }
  ]

  return (
    <section className="max-w-7xl mx-auto px-6 pt-32 pb-24 text-center relative">
      {/* Decorative dots */}
      <div className="absolute top-12 right-20 w-2 h-2 rounded-full bg-neko-purple-light/40 opacity-60"></div>
      <div className="absolute top-32 left-10 w-3 h-3 rounded-full bg-neko-purple/30 opacity-40"></div>
      <div className="absolute bottom-32 right-10 w-2 h-2 rounded-full bg-neko-purple-light/30 opacity-50"></div>

      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-neko-purple/15 border border-neko-purple/40 mb-10 hover:border-neko-purple-light/50 transition-all duration-300 hover:shadow-lg hover:shadow-neko-purple/20">
        <div className="w-2 h-2 rounded-full bg-neko-purple-light animate-pulse"></div>
        <span className="text-neko-purple-light text-xs font-semibold uppercase tracking-wide">Now with real-time incident correlation</span>
      </div>

      {/* Main Heading */}
      <div className="mb-8">
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-white leading-tight mb-3 tracking-tight">
          Monitor your <br />
          <span className="inline-block">
            infrastructure
          </span>
        </h1>
        <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-neko-purple-light leading-tight">
          in real time.
        </h2>
      </div>

      {/* Subheading */}
      <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed font-light">
        Unified visibility for servers, alerts, resource usage, and operational health — designed for teams that need to move fast without breaking things.
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-24">
        <Link 
          to="/operations" 
          className="group bg-gradient-to-r from-neko-purple to-neko-purple-light text-white px-8 py-3.5 rounded-full font-semibold hover:shadow-2xl hover:shadow-neko-purple/50 transition-all duration-300 flex items-center gap-2 hover:-translate-y-1 border border-neko-purple-light/30"
        >
          Go to Operations
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </Link>

        <a 
          href="#features" 
          className="border-2 border-neko-border text-slate-200 hover:text-neko-purple-light px-8 py-3 rounded-full font-semibold hover:bg-neko-purple/15 transition-all duration-300 hover:border-neko-purple-light/50 backdrop-blur-sm"
        >
          Explore Features
        </a>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4 max-w-5xl mx-auto">
        {stats.map((stat, idx) => (
          <div 
            key={idx}
            className="group p-6 rounded-2xl bg-neko-panel/60 border border-neko-border/50 hover:border-neko-purple-light/40 transition-all duration-300 hover:bg-neko-panel/80 hover:shadow-lg hover:shadow-neko-purple/20 backdrop-blur-sm"
          >
            <div className="text-3xl md:text-4xl font-black text-neko-purple-light mb-2 group-hover:text-white transition-colors duration-300">{stat.value}</div>
            <div className="text-xs text-slate-400 uppercase tracking-widest font-medium">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
