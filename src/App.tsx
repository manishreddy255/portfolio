import { useEffect, useRef, useState } from 'react'
import { Linkedin, Mail, MapPin, ExternalLink, ChevronDown } from 'lucide-react'
import { Terminal } from '@/components/Terminal'

function App() {
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({})
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }))
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    document.querySelectorAll('[data-animate]').forEach((el) => {
      observerRef.current?.observe(el)
    })

    return () => observerRef.current?.disconnect()
  }, [])

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-sm font-medium tracking-tight">AMR</span>
          <div className="flex items-center gap-6 text-sm">
            <button onClick={() => scrollToSection('about')} className="text-muted-foreground hover:text-foreground transition-colors">
              About
            </button>
            <button onClick={() => scrollToSection('experience')} className="text-muted-foreground hover:text-foreground transition-colors">
              Experience
            </button>
            <button onClick={() => scrollToSection('terminal')} className="text-muted-foreground hover:text-foreground transition-colors">
              Terminal
            </button>
            <button onClick={() => scrollToSection('skills')} className="text-muted-foreground hover:text-foreground transition-colors">
              Skills
            </button>
            <button onClick={() => scrollToSection('contact')} className="text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center px-6 pt-20">
        <div className="max-w-5xl mx-auto w-full">
          <div 
            data-animate 
            id="hero"
            className={`transition-all duration-700 ${isVisible['hero'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
          >
            <p className="text-sm text-muted-foreground mb-4">Hello, I'm</p>
            <h1 className="text-5xl md:text-7xl font-semibold tracking-tight mb-6">
              Are Manish Reddy
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl leading-relaxed mb-8">
              Technology Analyst & Full-Stack Engineer building production web platforms with React, Spring Boot, and AWS
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-12">
              <MapPin className="w-4 h-4" />
              <span>Kidlington, England, United Kingdom</span>
            </div>
            <div className="flex items-center gap-4">
              <a 
                href="https://linkedin.com/in/aremanishreddy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-foreground text-background rounded-full text-sm font-medium hover:bg-foreground/90 transition-colors"
              >
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </a>
              <button 
                onClick={() => scrollToSection('contact')}
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-border rounded-full text-sm font-medium hover:bg-secondary transition-colors"
              >
                <Mail className="w-4 h-4" />
                Get in touch
              </button>
            </div>
          </div>
          
          <button 
            onClick={() => scrollToSection('about')}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 text-muted-foreground hover:text-foreground transition-colors animate-bounce"
          >
            <ChevronDown className="w-6 h-6" />
          </button>
        </div>
      </section>

      {/* About Section */}
      <section id="about" data-animate className="py-24 px-6">
        <div className={`max-w-5xl mx-auto transition-all duration-700 delay-100 ${isVisible['about'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <h2 className="text-sm font-medium text-muted-foreground mb-8 uppercase tracking-wider">About</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <p className="text-lg leading-relaxed">
                I'm a Full-Stack Engineer with 4+ years of experience at Infosys, delivering production web platforms across frontend, backend, and cloud infrastructure.
              </p>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Currently based in the UK, I work on modern UI architecture using GraphQL, React, Vite, and microfrontends. I'm experienced in incident management, migration planning, and cross-team delivery.
              </p>
            </div>
            <div className="space-y-6">
              <p className="text-lg leading-relaxed text-muted-foreground">
                My expertise spans the full stack — from building responsive React applications to deploying scalable services on AWS and Kubernetes.
              </p>
              <p className="text-lg leading-relaxed text-muted-foreground">
                I'm also actively exploring practical agentic AI workflows for software development, experimenting with tools like Claude and Kiro for local multi-agent coding workflows.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" data-animate className="py-24 px-6 border-t border-border/50">
        <div className={`max-w-5xl mx-auto transition-all duration-700 ${isVisible['experience'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <h2 className="text-sm font-medium text-muted-foreground mb-12 uppercase tracking-wider">Experience</h2>
          
          <div className="space-y-12">
            {/* Current Role */}
            <div className="group">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-4">
                <div>
                  <h3 className="text-xl font-medium">Technology Analyst</h3>
                  <p className="text-muted-foreground">Infosys</p>
                </div>
                <span className="text-sm text-muted-foreground">Jan 2025 – Present</span>
              </div>
              <p className="text-muted-foreground mb-3">Oxford, England, UK</p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="w-1 h-1 rounded-full bg-foreground mt-2.5 flex-shrink-0" />
                  <span>Building modern UI architecture using GraphQL, React, Vite, and microfrontends</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1 h-1 rounded-full bg-foreground mt-2.5 flex-shrink-0" />
                  <span>Developing platform integrations with Kafka, PostgreSQL, and Oracle</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1 h-1 rounded-full bg-foreground mt-2.5 flex-shrink-0" />
                  <span>Supporting migration planning and phased rollout from legacy systems</span>
                </li>
              </ul>
            </div>

            {/* Previous Role 1 */}
            <div className="group">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-4">
                <div>
                  <h3 className="text-xl font-medium">Senior System Engineer</h3>
                  <p className="text-muted-foreground">Infosys</p>
                </div>
                <span className="text-sm text-muted-foreground">Jan 2024 – Jan 2025</span>
              </div>
              <p className="text-muted-foreground mb-3">Hyderabad, India</p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="w-1 h-1 rounded-full bg-foreground mt-2.5 flex-shrink-0" />
                  <span>Delivered frontend MVP features in React for internal workflow tools</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1 h-1 rounded-full bg-foreground mt-2.5 flex-shrink-0" />
                  <span>Built backend services with Spring Boot and supported Kubernetes deployments</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1 h-1 rounded-full bg-foreground mt-2.5 flex-shrink-0" />
                  <span>Managed incidents and observability using ELK with day-to-day AWS operations</span>
                </li>
              </ul>
            </div>

            {/* Previous Role 2 */}
            <div className="group">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-4">
                <div>
                  <h3 className="text-xl font-medium">System Engineer</h3>
                  <p className="text-muted-foreground">Infosys</p>
                </div>
                <span className="text-sm text-muted-foreground">Nov 2021 – Jan 2024</span>
              </div>
              <p className="text-muted-foreground mb-3">Hyderabad, India</p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="w-1 h-1 rounded-full bg-foreground mt-2.5 flex-shrink-0" />
                  <span>Built and delivered features for a B2B books and invoicing platform using React, Django, and SQL</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1 h-1 rounded-full bg-foreground mt-2.5 flex-shrink-0" />
                  <span>Worked in a development team to ship production functionality within a 6-month timeline</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Education */}
          <div className="mt-16 pt-12 border-t border-border/50">
            <h3 className="text-sm font-medium text-muted-foreground mb-6 uppercase tracking-wider">Education</h3>
            <div>
              <h4 className="text-lg font-medium">Bachelor of Technology (B.Tech), Computer Science</h4>
              <p className="text-muted-foreground">St. Mary's Integrated Campus Hyderabad</p>
              <p className="text-sm text-muted-foreground mt-1">2017 – 2021</p>
            </div>
          </div>
        </div>
      </section>

      {/* Terminal Section */}
      <section id="terminal" data-animate className="py-24 px-6 border-t border-border/50">
        <div className={`max-w-5xl mx-auto transition-all duration-700 ${isVisible['terminal'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">Interactive Terminal</h2>
              <p className="text-2xl md:text-3xl font-medium mb-4">
                Prefer the command line?
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                I've built an interactive terminal right into my portfolio. Type commands to explore my background, skills, and experience.
              </p>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Try <code className="px-1.5 py-0.5 bg-secondary rounded text-xs">help</code> to see all commands
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Use <code className="px-1.5 py-0.5 bg-secondary rounded text-xs">skills frontend</code> to filter skills
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Run <code className="px-1.5 py-0.5 bg-secondary rounded text-xs">neofetch</code> for a surprise
                </p>
              </div>
            </div>
            <Terminal />
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" data-animate className="py-24 px-6 border-t border-border/50">
        <div className={`max-w-5xl mx-auto transition-all duration-700 ${isVisible['skills'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <h2 className="text-sm font-medium text-muted-foreground mb-12 uppercase tracking-wider">Skills</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div>
              <h3 className="text-sm font-medium mb-4 uppercase tracking-wider">Frontend</h3>
              <div className="flex flex-wrap gap-2">
                {['React.js', 'Redux.js', 'JavaScript', 'Vite', 'Micro Frontends'].map((skill) => (
                  <span key={skill} className="px-3 py-1.5 bg-secondary rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-4 uppercase tracking-wider">Backend</h3>
              <div className="flex flex-wrap gap-2">
                {['Spring Boot', 'Django', 'Node.js', 'GraphQL'].map((skill) => (
                  <span key={skill} className="px-3 py-1.5 bg-secondary rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-4 uppercase tracking-wider">Cloud & DevOps</h3>
              <div className="flex flex-wrap gap-2">
                {['AWS', 'Kubernetes', 'Terraform', 'Jenkins', 'Shell Scripting'].map((skill) => (
                  <span key={skill} className="px-3 py-1.5 bg-secondary rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-4 uppercase tracking-wider">Data & Messaging</h3>
              <div className="flex flex-wrap gap-2">
                {['MySQL', 'PostgreSQL', 'Oracle', 'MongoDB', 'Kafka'].map((skill) => (
                  <span key={skill} className="px-3 py-1.5 bg-secondary rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-4 uppercase tracking-wider">Monitoring</h3>
              <div className="flex flex-wrap gap-2">
                {['Elastic Stack (ELK)', 'Incident Management'].map((skill) => (
                  <span key={skill} className="px-3 py-1.5 bg-secondary rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-4 uppercase tracking-wider">Exploring</h3>
              <div className="flex flex-wrap gap-2">
                {['Agentic AI', 'Multi-agent Workflows', 'Claude', 'Kiro'].map((skill) => (
                  <span key={skill} className="px-3 py-1.5 bg-secondary rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" data-animate className="py-24 px-6 border-t border-border/50">
        <div className={`max-w-5xl mx-auto transition-all duration-700 ${isVisible['contact'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <h2 className="text-sm font-medium text-muted-foreground mb-8 uppercase tracking-wider">Contact</h2>
          
          <div className="max-w-2xl">
            <p className="text-2xl md:text-3xl leading-relaxed mb-8">
              I'm always open to discussing new opportunities, interesting projects, or just having a chat about technology.
            </p>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <a 
                href="https://linkedin.com/in/aremanishreddy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 text-lg hover:text-muted-foreground transition-colors"
              >
                <Linkedin className="w-5 h-5" />
                linkedin.com/in/aremanishreddy
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border/50">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Are Manish Reddy. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a 
              href="https://linkedin.com/in/aremanishreddy" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
