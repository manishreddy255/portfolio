# Building an Interactive Terminal Component

This guide explains how the interactive terminal component in this portfolio works and how you can build or customize your own.

## Table of Contents
- [Overview](#overview)
- [Architecture](#architecture)
- [Key Features](#key-features)
- [Implementation Details](#implementation-details)
- [Adding New Commands](#adding-new-commands)
- [Customization](#customization)
- [Best Practices](#best-practices)

---

## Overview

The Terminal component creates a fully functional, interactive command-line interface (CLI) within your React application. It's designed to:

- Feel like a real terminal (dark theme, monospace font, blinking cursor)
- Support keyboard navigation (arrow keys, tab completion)
- Display rich output (React nodes, not just strings)
- Maintain command history
- Scroll automatically to show new output

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Terminal Component                                          │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Header (traffic lights + title)                      │  │
│  ├───────────────────────────────────────────────────────┤  │
│  │  Output Area                                          │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │  Command 1 Output                               │  │  │
│  │  │  Command 2 Output                               │  │  │
│  │  │  ...                                            │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  ├───────────────────────────────────────────────────────┤  │
│  │  Input Line                                           │  │
│  │  prompt$ [user input here] █                          │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### State Management

```typescript
interface Command {
  input: string       // What the user typed
  output: ReactNode   // What to display (can be JSX!)
  isError?: boolean   // Flag for error styling
}

// State hooks
const [history, setHistory] = useState<Command[]>([])           // Command history with outputs
const [input, setInput] = useState('')                          // Current input value
const [historyIndex, setHistoryIndex] = useState(-1)            // For up/down navigation
const [commandHistory, setCommandHistory] = useState<string[]>([]) // Just the commands
```

---

## Key Features

### 1. Command Registry

Commands are stored in a plain object where keys are command names and values are handler functions:

```typescript
const COMMANDS: Record<string, (args: string[]) => React.ReactNode> = {
  help: () => <div>...</div>,
  about: () => <div>...</div>,
  skills: (args) => {
    // args[0] would be the first argument
    return <div>...</div>
  },
  // ... more commands
}
```

**Why this approach?**
- Simple to add new commands
- Type-safe with TypeScript
- Handler can return any React node (JSX, components, etc.)

### 2. Keyboard Navigation

| Key | Action |
|-----|--------|
| `Enter` | Execute current command |
| `↑` | Navigate to previous command in history |
| `↓` | Navigate to next command in history |
| `Tab` | Auto-complete command names |

Implementation:

```typescript
const handleKeyDown = (e: React.KeyboardEvent) => {
  if (e.key === 'Enter') {
    executeCommand(input)
    setInput('')
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    // Navigate backwards through command history
    if (historyIndex < commandHistory.length - 1) {
      const newIndex = historyIndex + 1
      setHistoryIndex(newIndex)
      setInput(commandHistory[commandHistory.length - 1 - newIndex])
    }
  } else if (e.key === 'Tab') {
    e.preventDefault()
    // Simple auto-complete
    const commands = Object.keys(COMMANDS)
    const match = commands.find(cmd => cmd.startsWith(input.toLowerCase()))
    if (match) setInput(match)
  }
}
```

### 3. Auto-Scrolling

The terminal automatically scrolls to show the newest output:

```typescript
const scrollRef = useRef<HTMLDivElement>(null)

useEffect(() => {
  if (scrollRef.current) {
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }
}, [history]) // Runs whenever history changes
```

### 4. Click-to-Focus

Clicking anywhere in the terminal focuses the input:

```typescript
const handleTerminalClick = () => {
  inputRef.current?.focus()
}
```

---

## Implementation Details

### The `executeCommand` Function

This is the core logic that processes user input:

```typescript
const executeCommand = useCallback((cmdInput: string) => {
  const trimmed = cmdInput.trim()
  if (!trimmed) return

  // Add to command history for up/down navigation
  setCommandHistory(prev => [...prev, trimmed])
  setHistoryIndex(-1)

  // Parse command and arguments
  const [cmd, ...args] = trimmed.toLowerCase().split(' ')
  const handler = COMMANDS[cmd]

  if (cmd === 'clear') {
    // Special case: clear history
    setHistory([])
  } else if (handler) {
    // Execute handler and store result
    const output = handler(args)
    setHistory(prev => [...prev, { input: trimmed, output }])
  } else {
    // Unknown command
    setHistory(prev => [
      ...prev,
      {
        input: trimmed,
        output: <div>Command not found: {cmd}</div>,
        isError: true,
      },
    ])
  }
}, [])
```

### Rendering the Terminal

```tsx
<Card className="w-full bg-zinc-950 border-zinc-800 overflow-hidden shadow-2xl">
  {/* Header with traffic lights */}
  <CardHeader className="bg-zinc-900/50 border-b border-zinc-800">
    <div className="flex items-center gap-1.5">
      <div className="w-3 h-3 rounded-full bg-red-500/80" />
      <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
      <div className="w-3 h-3 rounded-full bg-green-500/80" />
    </div>
  </CardHeader>

  {/* Scrollable content area */}
  <CardContent
    ref={scrollRef}
    onClick={handleTerminalClick}
    className="font-mono text-sm min-h-[320px] max-h-[400px] overflow-y-auto"
  >
    {/* Render history */}
    {history.map((cmd, i) => (
      <div key={i}>
        {cmd.input && (
          <div>
            <span className="text-emerald-400">visitor@portfolio:~$</span>
            <span>{cmd.input}</span>
          </div>
        )}
        <div>{cmd.output}</div>
      </div>
    ))}

    {/* Input line */}
    <div className="flex items-center gap-2">
      <span className="text-emerald-400">visitor@portfolio:~$</span>
      <input
        ref={inputRef}
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 bg-transparent outline-none"
      />
      <span className="w-2 h-4 bg-emerald-400/80 animate-pulse" /> {/* Cursor */}
    </div>
  </CardContent>
</Card>
```

---

## Adding New Commands

### Basic Command

```typescript
const COMMANDS = {
  // ... existing commands

  hello: () => (
    <div className="text-emerald-400">
      Hello, World! 👋
    </div>
  ),
}
```

### Command with Arguments

```typescript
const COMMANDS = {
  // ... existing commands

  greet: (args) => {
    const name = args[0] || 'stranger'
    return (
      <div className="text-emerald-400">
        Hello, {name}! Nice to meet you.
      </div>
    )
  },
}
```

Usage: `greet Manish` → "Hello, Manish! Nice to meet you."

### Command with Complex Output

```typescript
const COMMANDS = {
  projects: () => (
    <div className="space-y-2">
      <p className="text-emerald-400">My Projects:</p>
      {[
        { name: 'Portfolio', tech: 'React, Tailwind' },
        { name: 'API Gateway', tech: 'Spring Boot, AWS' },
      ].map(project => (
        <div key={project.name} className="pl-4">
          <span className="text-cyan-400">→ {project.name}</span>
          <span className="text-muted-foreground text-xs ml-2">
            ({project.tech})
          </span>
        </div>
      ))}
    </div>
  ),
}
```

---

## Customization

### Change Colors

```typescript
// Current theme uses these Tailwind classes:
const THEME = {
  background: 'bg-zinc-950',      // Terminal background
  header: 'bg-zinc-900/50',       // Header background
  prompt: 'text-emerald-400',     // Prompt color ($)
  command: 'text-zinc-100',       // Typed command
  output: 'text-muted-foreground', // Default output
  error: 'text-red-400',          // Error messages
  accent: 'text-cyan-400',        // Highlighted text
}
```

### Change Prompt

```tsx
// Current prompt
<span className="text-emerald-400">visitor@portfolio:~$</span>

// Change to something else
<span className="text-emerald-400">manish@dev-machine ➜</span>
<span className="text-blue-400">user@server #</span>
```

### Add More Traffic Light Actions

```tsx
// In the header, make buttons clickable
<div className="flex items-center gap-1.5">
  <button
    onClick={() => alert('Close clicked!')}
    className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500"
  />
  {/* ... */}
</div>
```

---

## Best Practices

### 1. Keep Commands Fast

Commands execute synchronously. For async operations:

```typescript
fetchData: async () => {
  // Don't do this - blocks the UI
  const data = await fetch('/api/data')
  return <div>{data}</div>
}

// Instead, show a loading state
fetchData: () => {
  fetch('/api/data').then(data => {
    // Update state with new output
  })
  return <div>Loading...</div>
}
```

### 2. Sanitize User Input

The current implementation is safe (no `eval`), but if you add dynamic commands:

```typescript
// BAD - security risk
const dangerousCommand = (args) => {
  return eval(args.join(' '))  // Never do this!
}

// GOOD - whitelist allowed operations
const safeCommand = (args) => {
  const allowed = ['option1', 'option2']
  if (allowed.includes(args[0])) {
    return processOption(args[0])
  }
  return <div>Invalid option</div>
}
```

### 3. Limit History Size

Prevent memory issues with long sessions:

```typescript
const MAX_HISTORY = 100

// In executeCommand
setHistory(prev => {
  const newHistory = [...prev, command]
  return newHistory.slice(-MAX_HISTORY)
})
```

### 4. Persist History (Optional)

```typescript
// Save to localStorage
useEffect(() => {
  localStorage.setItem('terminal-history', JSON.stringify(commandHistory))
}, [commandHistory])

// Load on mount
useEffect(() => {
  const saved = localStorage.getItem('terminal-history')
  if (saved) {
    setCommandHistory(JSON.parse(saved))
  }
}, [])
```

---

## Available Commands

| Command | Arguments | Description |
|---------|-----------|-------------|
| `help` | - | Show all available commands |
| `about` | - | About me |
| `skills` | `[category]` | List skills (frontend, backend, cloud, data, monitoring, exploring, all) |
| `experience` | - | Work experience |
| `contact` | - | Contact information |
| `now` | - | What I'm currently working on |
| `whoami` | - | Current user |
| `date` | - | Current date and time |
| `clear` | - | Clear terminal screen |
| `echo` | `<message>` | Echo a message |
| `sudo` | - | Try it 😉 |
| `neofetch` | - | System info with ASCII art |

---

## Testing the Terminal

Manual test checklist:

- [ ] Type `help` and see command list
- [ ] Type `skills frontend` to filter skills
- [ ] Press `↑` to recall previous command
- [ ] Press `Tab` to auto-complete command
- [ ] Type unknown command and see error
- [ ] Type `clear` to clear history
- [ ] Click in terminal to focus input
- [ ] Scroll through long output
- [ ] Resize window - terminal adapts

---

## Future Enhancements

Ideas to extend the terminal:

1. **File System Simulation** - `cd`, `ls`, `cat` commands
2. **Theme Switching** - `theme dark|light`
3. **Mini Games** - `snake`, `tetris` in terminal
4. **API Integration** - `weather`, `news` commands
5. **Multi-line Input** - Support for multi-line commands
6. **Syntax Highlighting** - Colorize command output
7. **Copy/Paste** - Right-click context menu

---

## Resources

- [React useRef Hook](https://react.dev/reference/react/useRef)
- [React useCallback Hook](https://react.dev/reference/react/useCallback)
- [TypeScript Record Type](https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type)
- [Tailwind Typography](https://tailwindcss.com/docs/font-family)
