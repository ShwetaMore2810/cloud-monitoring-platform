import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, Check } from 'lucide-react'

export default function CTASection() {
  const features = [
    'No credit card required',
    '14-day free trial',
    'Cancel anytime'
  ]

  return (
    <section id="cta" className="max-w-5xl mx-auto px-6 py-24 relative">
      <div className="relative group">
        {/* Animated Gradient Background */}
        <div className="absolute -inset-1 bg-gradient-to-r from-neko-purple/40 to-neko-purple/10 rounded-3xl blur-2xl opacity-75 group-hover:opacity-100 transition duration-500 animate-pulse"></div>

        {/* Main CTA Card */}
        <div className="relative rounded-3xl border border-neko-border/50 bg-gradient-to-br from-neko-panel/80 to-neko-panel/40 p-12 md:p-16 text-center overflow-hidden hover:border-neko-purple-light/40 transition-all duration-300 backdrop-blur-sm">
          
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-neko-purple/10 rounded-full blur-3xl opacity-40 pointer-events-none"></div>
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-neko-purple/5 rounded-full blur-3xl opacity-30 pointer-events-none"></div>

          {/* Content */}
          <div className="relative z-10">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-neko-purple/20 border border-neko-purple/50 mb-8 group-hover:border-neko-purple-light/60 transition-all duration-300">
              <div className="w-2 h-2 rounded-full bg-neko-purple-light animate-pulse"></div>
              <span className="text-neko-purple-light text-xs font-bold uppercase tracking-wide">Limited Time Offer</span>
            </div>

            {/* Headline */}
            <h3 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
              Ready to monitor with <span className="text-neko-purple-light">confidence?</span>
            </h3>

            {/* Description */}
            <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed font-light">
              Experience comprehensive infrastructure monitoring with our powerful dashboard. 
              Manage everything in one place with real-time insights and intelligent alerts.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-12">
              <Link 
                to="/operations" 
                className="group/btn bg-gradient-to-r from-neko-purple to-neko-purple-light hover:shadow-2xl hover:shadow-neko-purple/50 text-white px-8 py-3.5 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 hover:-translate-y-1 border border-neko-purple-light/40"
              >
                <Sparkles size={20} />
                Launch Dashboard Now
                <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
              </Link>

              <a 
                href="mailto:support@nekomonitor.com" 
                className="border-2 border-neko-border text-slate-200 hover:text-neko-purple-light px-8 py-3 rounded-full font-semibold hover:bg-neko-purple/20 transition-all duration-300 hover:border-neko-purple-light/60 backdrop-blur-sm"
              >
                Contact Sales
              </a>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-sm text-slate-400 pt-12 border-t border-neko-border/30">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2 hover:text-neko-purple-light transition-colors duration-300">
                  <Check size={16} className="text-neko-purple-light flex-shrink-0" />
                  <span className="font-light">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
