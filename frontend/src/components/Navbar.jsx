import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0a0a0f]/60 border-b border-neko-border/40 shadow-lg shadow-neko-purple/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/LandingPage" className="group flex items-center gap-2.5">
          <div className="w-9 h-9 bg-gradient-to-br from-neko-purple-light to-neko-purple rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-neko-purple/40">
            <span className="text-white font-bold text-sm">N</span>
          </div>
          <span className="text-white font-semibold text-lg hidden sm:inline">
            Neko <span className="text-neko-purple-light">Monitor</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        {/* <nav className="hidden md:flex items-center gap-10">
          <a href="#features" className="text-slate-300 hover:text-neko-purple-light transition-colors text-sm font-medium">Features</a>
          <a href="#tech" className="text-slate-300 hover:text-neko-purple-light transition-colors text-sm font-medium">Tech Stack</a>
          <a href="#cta" className="text-slate-300 hover:text-neko-purple-light transition-colors text-sm font-medium">Get Started</a>
        </nav> */}

        {/* Desktop CTA Button */}
        <Link 
          to="/Accounts" 
          className="hidden md:block bg-gradient-to-r from-neko-purple to-neko-purple-light text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:shadow-xl hover:shadow-neko-purple/50 transition-all duration-300 hover:-translate-y-0.5 border border-neko-purple-light/30"
        >
          Accounts
        </Link>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-slate-200 p-2 hover:text-neko-purple-light transition-colors"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t border-neko-border/40 bg-[#0a0a0f]/95 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 py-4 space-y-3">
            <a href="#features" className="block text-slate-300 hover:text-neko-purple-light py-2 text-sm transition-colors">Features</a>
            <a href="#tech" className="block text-slate-300 hover:text-neko-purple-light py-2 text-sm transition-colors">Tech Stack</a>
            <a href="#cta" className="block text-slate-300 hover:text-neko-purple-light py-2 text-sm transition-colors">Get Started</a>
            <Link to="/operations" className="block bg-gradient-to-r from-neko-purple to-neko-purple-light text-white px-4 py-2.5 rounded-full text-sm font-semibold text-center transition-all duration-300">
              Dashboard
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
