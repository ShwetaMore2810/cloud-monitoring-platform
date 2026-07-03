import React from 'react'
import { 
  SiReact, SiVite, SiTailwindcss, 
  SiNodedotjs, SiPostgresql, SiDocker 
} from 'react-icons/si'
import { ArrowRight } from 'lucide-react'

export default function TechStack() {
  const techCategories = [
    {
      category: 'Frontend',
      icon: SiReact,
      technologies: [
        { name: 'React', description: 'UI Framework', icon: SiReact },
        { name: 'Vite', description: 'Build Tool', icon: SiVite },
        { name: 'Tailwind CSS', description: 'Styling', icon: SiTailwindcss }
      ]
    },
    {
      category: 'Backend',
      icon: SiNodedotjs,
      technologies: [
        { name: 'Node.js', description: 'Runtime', icon: SiNodedotjs },
        { name: 'PostgreSQL', description: 'Database', icon: SiPostgresql },
        { name: 'Docker', description: 'Containerization', icon: SiDocker }
      ]
    }
  ]

  const benefits = [
    { title: 'High Performance', description: 'Lightning-fast load times and real-time updates' },
    { title: 'Scalability', description: 'Handles millions of metrics with ease' },
    { title: 'Security First', description: 'Enterprise-grade security standards' },
    { title: 'Developer Friendly', description: 'Easy to extend and maintain' }
  ]

  return (
    <section id="tech" className="max-w-7xl mx-auto px-6 py-24 relative">
      {/* Section Header */}
      <div className="text-center mb-24">
        <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
          Powered by <span className="text-neko-purple-light">industry-leading</span> technologies
        </h2>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto font-light">
          A carefully selected stack of proven technologies that delivers reliability, performance, and scalability at enterprise scale.
        </p>
      </div>

      {/* Tech Stack by Category */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        {techCategories.map((cat, catIdx) => (
          <div key={catIdx} className="relative group">
            {/* Gradient Border Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-neko-purple/20 to-neko-purple/5 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-500"></div>

            {/* Category Card */}
            <div className="relative bg-gradient-to-br from-neko-panel/80 to-neko-panel/40 border border-neko-border/50 rounded-2xl p-8 hover:border-neko-purple-light/40 transition-all duration-300 backdrop-blur-sm">
              
              {/* Category Header */}
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-neko-purple/30 to-neko-purple/10 flex items-center justify-center">
                  <cat.icon size={24} className="text-neko-purple-light" />
                </div>
                <h3 className="text-2xl font-black text-white">{cat.category}</h3>
              </div>

              {/* Technologies Grid */}
              <div className="space-y-4">
                {cat.technologies.map((tech, idx) => (
                  <div 
                    key={idx}
                    className="group/tech p-4 rounded-lg border border-neko-border/30 bg-neko-panel-2/40 hover:border-neko-purple-light/40 hover:bg-neko-panel/60 transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex items-center justify-center gap-5">
                      <div className="w-10 h-10 rounded-lg  bg-neko-purple/15 flex items-center justify-center group-hover/tech:bg-neko-purple/25 transition-all duration-300">
                        <tech.icon size={20} className="text-neko-purple-light" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-bold text-xl group-hover/tech:text-neko-purple-light transition-colors duration-300">{tech.name}</h4>
                        <p className="text-slate-500 text-sm font-light">{tech.description}</p>
                      </div>
                      {/* <ArrowRight size={16} className="text-slate-400 opacity-0 group-hover/tech:opacity-100 group-hover/tech:translate-x-1 transition-all duration-300" /> */}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Key Benefits */}
      <div className="">
        <h3 className="text-5xl font-black text-white mb-10 text-center">Why This Stack</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {benefits.map((benefit, idx) => (
            <div 
              key={idx}
              className="group p-10 rounded-xl border border-neko-border/50 bg-gradient-to-br from-neko-panel/60 to-neko-panel/20 hover:border-neko-purple-light/40 transition-all duration-300 hover:bg-neko-panel/70 hover:shadow-lg hover:shadow-neko-purple/15 hover:-translate-y-1 cursor-pointer"
            >
              <h4 className="text-white text-2xl font-bold mb-8 group-hover:text-neko-purple-light transition-colors duration-300">{benefit.title}</h4>
              <p className="text-slate-400 text-xl font-bold leading-relaxed">{benefit.description}</p>
              <div className=" w-0 bg-gradient-to-r from-neko-purple-light to-transparent group-hover:w-full transition-all duration-500"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
