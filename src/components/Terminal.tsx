import { useState, useRef, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Terminal as TerminalIcon } from 'lucide-react'

interface Command {
  input: string
  output: React.ReactNode
  isError?: boolean
}

const COMMANDS: Record<string, (args: string[]) => React.ReactNode> = {
  help: () => (
    <div className="space-y-1">
      <p className="text-emerald-400">Available commands:</p>
      <div className="grid grid-cols-2 gap-x-8 gap-y-1 mt-2 text-sm">
        <span className="text-cyan-400">help</span>
        <span className="text-muted-foreground">Show this help message</span>
        <span className="text-cyan-400">about</span>
        <span className="text-muted-foreground">About me</span>
        <span className="text-cyan-400">skills [category]</span>
        <span className="text-muted-foreground">List skills (frontend|backend|cloud|all)</span>
        <span className="text-cyan-400">experience</span>
        <span className="text-muted-foreground">Work experience</span>
        <span className="text-cyan-400">contact</span>
        <span className="text-muted-foreground">Contact information</span>
        <span className="text-cyan-400">now</span>
        <span className="text-muted-foreground">What I'm up to now</span>
        <span className="text-cyan-400">whoami</span>
        <span className="text-muted-foreground">Current user</span>
        <span className="text-cyan-400">date</span>
        <span className="text-muted-foreground">Current date and time</span>
        <span className="text-cyan-400">clear</span>
        <span className="text-muted-foreground">Clear terminal</span>
      </div>
    </div>
  ),

  about: () => (
    <div className="space-y-2">
      <p className="text-emerald-400">Are Manish Reddy</p>
      <p className="text-sm text-muted-foreground">
        Full-Stack Engineer with 4+ years of experience building production web platforms.
        Currently based in Oxford, UK, working at Infosys as a Technology Analyst.
      </p>
      <p className="text-sm text-muted-foreground">
        Passionate about React, Spring Boot, AWS, and exploring Agentic AI workflows.
      </p>
    </div>
  ),

  skills: (args) => {
    const category = args[0] || 'all'
    const skills: Record<string, string[]> = {
      frontend: ['React.js', 'Redux.js', 'JavaScript', 'Vite', 'Micro Frontends', 'TypeScript'],
      backend: ['Spring Boot', 'Django', 'Node.js', 'GraphQL', 'REST APIs'],
      cloud: ['AWS', 'Kubernetes', 'Terraform', 'Jenkins', 'Docker'],
      data: ['MySQL', 'PostgreSQL', 'Oracle', 'MongoDB', 'Kafka'],
      monitoring: ['Elastic Stack (ELK)', 'Incident Management', 'Observability'],
      exploring: ['Agentic AI', 'Multi-agent Workflows', 'Claude', 'Kiro'],
    }

    if (category === 'all') {
      return (
        <div className="space-y-3">
          <p className="text-emerald-400">Skills by category:</p>
          {Object.entries(skills).map(([cat, items]) => (
            <div key={cat}>
              <span className="text-cyan-400 text-sm capitalize">{cat}:</span>
              <span className="text-sm text-muted-foreground ml-2">{items.join(', ')}</span>
            </div>
          ))}
          <p className="text-xs text-muted-foreground mt-2">
            Tip: Use `skills frontend` to filter by category
          </p>
        </div>
      )
    }

    if (skills[category]) {
      return (
        <div className="space-y-2">
          <p className="text-emerald-400 capitalize">{category} Skills:</p>
          <div className="flex flex-wrap gap-2">
            {skills[category].map((skill) => (
              <span
                key={skill}
                className="px-2 py-0.5 bg-secondary/50 rounded text-xs text-muted-foreground"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )
    }

    return (
      <div className="text-yellow-400">
        Unknown category: {category}. Try: frontend, backend, cloud, data, monitoring, exploring
      </div>
    )
  },

  experience: () => (
    <div className="space-y-4">
      <div>
        <p className="text-emerald-400">Technology Analyst @ Infosys</p>
        <p className="text-xs text-muted-foreground">Jan 2025 – Present | Oxford, UK</p>
        <p className="text-sm text-muted-foreground mt-1">
          Building modern UI architecture with GraphQL, React, Vite, and microfrontends.
        </p>
      </div>
      <div>
        <p className="text-emerald-400">Senior System Engineer @ Infosys</p>
        <p className="text-xs text-muted-foreground">Jan 2024 – Jan 2025 | Hyderabad, India</p>
        <p className="text-sm text-muted-foreground mt-1">
          Delivered React features, built Spring Boot services, managed Kubernetes deployments.
        </p>
      </div>
      <div>
        <p className="text-emerald-400">System Engineer @ Infosys</p>
        <p className="text-xs text-muted-foreground">Nov 2021 – Jan 2024 | Hyderabad, India</p>
        <p className="text-sm text-muted-foreground mt-1">
          Built B2B platform with React, Django, and SQL.
        </p>
      </div>
    </div>
  ),

  contact: () => (
    <div className="space-y-2">
      <p className="text-emerald-400">Get in touch:</p>
      <div className="space-y-1 text-sm">
        <p>
          <span className="text-cyan-400">LinkedIn:</span>{' '}
          <a
            href="https://linkedin.com/in/aremanishreddy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-emerald-400 transition-colors underline underline-offset-2"
          >
            linkedin.com/in/aremanishreddy
          </a>
        </p>
        <p>
          <span className="text-cyan-400">Location:</span>{' '}
          <span className="text-muted-foreground">Kidlington, Oxford, UK</span>
        </p>
        <p>
          <span className="text-cyan-400">Status:</span>{' '}
          <span className="text-emerald-400">●</span>{' '}
          <span className="text-muted-foreground">Open to opportunities</span>
        </p>
      </div>
    </div>
  ),

  now: () => (
    <div className="space-y-2">
      <p className="text-emerald-400">What I'm up to now:</p>
      <ul className="space-y-1 text-sm text-muted-foreground">
        <li className="flex items-start gap-2">
          <span className="text-cyan-400">→</span>
          <span>Working on microfrontend architecture at Infosys</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-cyan-400">→</span>
          <span>Exploring Agentic AI and multi-agent coding workflows</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-cyan-400">→</span>
          <span>Building this portfolio with React + Tailwind</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-cyan-400">→</span>
          <span>Learning advanced Kubernetes patterns</span>
        </li>
      </ul>
    </div>
  ),

  whoami: () => (
    <div className="text-emerald-400">
      visitor@portfolio:~$
      <span className="text-muted-foreground ml-2">(guest user with full read access)</span>
    </div>
  ),

  date: () => (
    <div className="text-muted-foreground">
      {new Date().toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short',
      })}
    </div>
  ),

  clear: () => null,

  echo: (args) => <div className="text-muted-foreground">{args.join(' ')}</div>,

  sudo: () => (
    <div className="text-red-400">
      [sudo] password for visitor: {'*'.repeat(8)}
      <br />
      <span className="text-red-500">visitor is not in the sudoers file. This incident will be reported. 😄</span>
    </div>
  ),

  neofetch: () => (
    <div className="font-mono text-xs leading-relaxed">
      <pre className="text-emerald-400">
{`       _           _        _ _           
      / \\___ _ __| |__  __| (_)___ ___   
     / _/ _ \\ '__| '_ \\/ _\` | / __/ __|  
    / ___  __/ |  | | | | (_| | \\__ \\__ \\  
   /_/   \\___|_|  |_| |_|\\__,_|_|___/___/  
                                           `}
      </pre>
      <div className="mt-2 space-y-1">
        <p><span className="text-cyan-400">OS:</span> <span className="text-muted-foreground">PortfolioOS 1.0</span></p>
        <p><span className="text-cyan-400">Host:</span> <span className="text-muted-foreground">Are Manish Reddy</span></p>
        <p><span className="text-cyan-400">Kernel:</span> <span className="text-muted-foreground">Full-Stack Engineer</span></p>
        <p><span className="text-cyan-400">Uptime:</span> <span className="text-muted-foreground">4+ years</span></p>
        <p><span className="text-cyan-400">Shell:</span> <span className="text-muted-foreground">React 19</span></p>
        <p><span className="text-cyan-400">WM:</span> <span className="text-muted-foreground">Tailwind CSS</span></p>
        <p><span className="text-cyan-400">Location:</span> <span className="text-muted-foreground">Oxford, UK</span></p>
      </div>
    </div>
  ),
}

export function Terminal() {
  const [history, setHistory] = useState<Command[]>([])
  const [input, setInput] = useState('')
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const executeCommand = useCallback((cmdInput: string) => {
    const trimmed = cmdInput.trim()
    if (!trimmed) return

    setCommandHistory((prev) => [...prev, trimmed])
    setHistoryIndex(-1)

    const [cmd, ...args] = trimmed.toLowerCase().split(' ')
    const handler = COMMANDS[cmd]

    if (cmd === 'clear') {
      setHistory([])
    } else if (handler) {
      const output = handler(args)
      setHistory((prev) => [...prev, { input: trimmed, output }])
    } else {
      setHistory((prev) => [
        ...prev,
        {
          input: trimmed,
          output: (
            <div className="text-red-400">
              Command not found: {cmd}. Type `help` for available commands.
            </div>
          ),
          isError: true,
        },
      ])
    }
  }, [])

  useEffect(() => {
    // Initial greeting
    setHistory([
      {
        input: '',
        output: (
          <div className="space-y-2">
            <p className="text-emerald-400">
              Welcome to PortfolioOS v1.0.0
            </p>
            <p className="text-sm text-muted-foreground">
              Type `help` to see available commands, or try `neofetch` for a fun surprise.
            </p>
          </div>
        ),
      },
    ])
  }, [])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [history])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommand(input)
      setInput('')
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1
        setHistoryIndex(newIndex)
        setInput(commandHistory[commandHistory.length - 1 - newIndex])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setInput(commandHistory[commandHistory.length - 1 - newIndex])
      } else if (historyIndex === 0) {
        setHistoryIndex(-1)
        setInput('')
      }
    } else if (e.key === 'Tab') {
      e.preventDefault()
      const commands = Object.keys(COMMANDS)
      const match = commands.find((cmd) => cmd.startsWith(input.toLowerCase()))
      if (match) {
        setInput(match)
      }
    }
  }

  const handleTerminalClick = () => {
    inputRef.current?.focus()
  }

  return (
    <Card className="w-full bg-zinc-950 border-zinc-800 overflow-hidden shadow-2xl">
      <CardHeader className="bg-zinc-900/50 border-b border-zinc-800 px-4 py-3 flex flex-row items-center gap-3">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <TerminalIcon className="w-3.5 h-3.5" />
          <span>visitor@portfolio:~</span>
        </div>
      </CardHeader>
      <CardContent
        className="p-4 font-mono text-sm min-h-[320px] max-h-[400px] overflow-y-auto cursor-text"
        onClick={handleTerminalClick}
        ref={scrollRef}
      >
        <div className="space-y-4">
          {history.map((cmd, i) => (
            <div key={i} className="space-y-1">
              {cmd.input && (
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400">visitor@portfolio:~$</span>
                  <span className="text-zinc-100">{cmd.input}</span>
                </div>
              )}
              <div className="pl-0">{cmd.output}</div>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <span className="text-emerald-400">visitor@portfolio:~$</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent outline-none text-zinc-100 placeholder:text-zinc-600"
              placeholder="Type a command..."
              spellCheck={false}
              autoComplete="off"
            />
            <span className="w-2 h-4 bg-emerald-400/80 animate-pulse" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
