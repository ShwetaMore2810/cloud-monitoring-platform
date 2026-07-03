import Navbar from '../components/Navbar.jsx'
import Hero from '../components/Hero.jsx'
import Features from '../components/Features.jsx'
import DashboardPreview from '../components/DashboardPreview.jsx'
import TechStack from '../components/TechStack.jsx'
import CTASection from '../components/CTASection.jsx'
import Footer from '../components/Footer.jsx'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#1a1a2e] to-[#0f0f1f] overflow-x-hidden">
      {/* Grid Background Pattern */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-neko-purple/5 to-transparent opacity-30"></div>
        <svg className="absolute w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" stroke="currentColor" strokeWidth="0.5" className="text-neko-purple/20"/>
        </svg>

        {/* Animated Blobs */}
        <div className="absolute top-0 -left-40 w-80 h-80 bg-neko-purple/8 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
        <div className="absolute top-40 -right-40 w-80 h-80 bg-neko-purple/8 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animation-delay-2000 animate-blob"></div>
        <div className="absolute -bottom-8 left-20 w-80 h-80 bg-neko-purple/8 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animation-delay-4000 animate-blob"></div>
      </div>

      <div className="relative z-10">
        <Navbar />
        <Hero />
        <Features />
        <DashboardPreview />
        <TechStack />
        <CTASection />
        <Footer />
      </div>
    </div>
  )
}
