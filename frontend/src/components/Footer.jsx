import { Link } from 'react-router-dom'
import {Mail, ExternalLink } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const links = {
    product: [
      { name: 'Features', href: '/' },
      { name: 'Pricing', href: '/' }
    ],
    company: [
      { name: 'About', href: '/' },
      { name: 'Contact', href: '/' }
    ],
    legal: [
      { name: 'Privacy Policy', href: '/' },
      { name: 'Terms of Service', href: '/' }
    ]
  }

  return (
    <footer className="border-t border-neko-border/30 bg-gradient-to-b from-[#0a0a0f] to-[#000000] relative overflow-hidden">
      
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-neko-purple/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-20">
        
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Column */}
          <div>
            <Link to="/" className="flex items-center gap-2.5 mb-6 group">
              <div className="w-8 h-8 bg-gradient-to-br from-neko-purple-light to-neko-purple rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <span className="text-white font-semibold">
                Neko <span className="text-neko-purple-light">Monitor</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 font-light">
              Real-time infrastructure monitoring for modern teams. Monitor with confidence, act with precision.
            </p>
            <div className="flex items-center gap-3">
              {/* <a href="#" className="w-10 h-10 rounded-lg bg-neko-panel/60 border border-neko-border/50 hover:border-neko-purple-light/50 flex items-center justify-center text-slate-400 hover:text-neko-purple-light transition-all duration-300 hover:bg-neko-purple/20">
                <Github size={18} />
              </a> */}
              <a href="mailto:hello@nekomonitor.com" className="w-10 h-10 rounded-lg bg-neko-panel/60 border border-neko-border/50 hover:border-neko-purple-light/50 flex items-center justify-center text-slate-400 hover:text-neko-purple-light transition-all duration-300 hover:bg-neko-purple/20">
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-white font-black text-sm uppercase mb-6 tracking-widest">Product</h4>
            <ul className="space-y-3">
              {links.product.map(link => (
                <li key={link.name}>
                  <Link 
                    to={link.href} 
                    className="text-slate-400 hover:text-neko-purple-light text-sm transition-colors duration-300 flex items-center gap-2 group font-light"
                  >
                    {link.name}
                    <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-white font-black text-sm uppercase mb-6 tracking-widest">Company</h4>
            <ul className="space-y-3">
              {links.company.map(link => (
                <li key={link.name}>
                  <Link 
                    to={link.href} 
                    className="text-slate-400 hover:text-neko-purple-light text-sm transition-colors duration-300 flex items-center gap-2 group font-light"
                  >
                    {link.name}
                    <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-white font-black text-sm uppercase mb-6 tracking-widest">Legal</h4>
            <ul className="space-y-3">
              {links.legal.map(link => (
                <li key={link.name}>
                  <Link 
                    to={link.href} 
                    className="text-slate-400 hover:text-neko-purple-light text-sm transition-colors duration-300 flex items-center gap-2 group font-light"
                  >
                    {link.name}
                    <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-neko-border/30 my-12"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-slate-400 text-sm font-light">
            &copy; {currentYear} Neko Monitor. All rights reserved.
          </p>

        </div>
      </div>
    </footer>
  )
}
