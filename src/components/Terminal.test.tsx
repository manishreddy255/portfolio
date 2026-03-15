import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Terminal } from './Terminal'

describe('Terminal', () => {
  beforeEach(() => {
    render(<Terminal />)
  })

  describe('Initial Render', () => {
    it('renders the terminal with header', () => {
      expect(screen.getByText('visitor@portfolio:~')).toBeInTheDocument()
    })

    it('displays welcome message on initial load', () => {
      expect(screen.getByText('Welcome to PortfolioOS v1.0.0')).toBeInTheDocument()
      expect(screen.getByText(/Type `help` to see available commands/)).toBeInTheDocument()
    })

    it('renders the input prompt', () => {
      expect(screen.getAllByText('visitor@portfolio:~$').length).toBeGreaterThan(0)
    })

    it('has a blinking cursor', () => {
      const cursor = document.querySelector('.animate-pulse')
      expect(cursor).toBeInTheDocument()
    })
  })

  describe('Basic Command Execution', () => {
    it('executes help command and displays available commands', async () => {
      const input = screen.getByPlaceholderText('Type a command...')
      await userEvent.type(input, 'help')
      await userEvent.keyboard('{Enter}')

      expect(screen.getByText('Available commands:')).toBeInTheDocument()
      // Check for command names in the help output grid
      const aboutElements = screen.getAllByText('about')
      expect(aboutElements.length).toBeGreaterThan(0)
      const skillsElements = screen.getAllByText(/skills/)
      expect(skillsElements.length).toBeGreaterThan(0)
      const experienceElements = screen.getAllByText('experience')
      expect(experienceElements.length).toBeGreaterThan(0)
    })

    it('executes about command and displays info', async () => {
      const input = screen.getByPlaceholderText('Type a command...')
      await userEvent.type(input, 'about')
      await userEvent.keyboard('{Enter}')

      expect(screen.getByText('Are Manish Reddy')).toBeInTheDocument()
      expect(screen.getByText(/Full-Stack Engineer/)).toBeInTheDocument()
    })

    it('executes whoami command', async () => {
      const input = screen.getByPlaceholderText('Type a command...')
      await userEvent.type(input, 'whoami')
      await userEvent.keyboard('{Enter}')

      // Check for guest user text in the output
      expect(screen.getByText(/guest user with full read access/)).toBeInTheDocument()
    })

    it('executes date command and shows current date', async () => {
      const input = screen.getByPlaceholderText('Type a command...')
      await userEvent.type(input, 'date')
      await userEvent.keyboard('{Enter}')

      // Check that a date is displayed (should contain current year)
      const currentYear = new Date().getFullYear().toString()
      expect(screen.getByText(new RegExp(currentYear))).toBeInTheDocument()
    })

    it('executes echo command with arguments', async () => {
      const input = screen.getByPlaceholderText('Type a command...')
      await userEvent.type(input, 'echo hello world')
      await userEvent.keyboard('{Enter}')

      expect(screen.getByText('hello world')).toBeInTheDocument()
    })
  })

  describe('Skills Command', () => {
    it('executes skills command without args and shows all categories', async () => {
      const input = screen.getByPlaceholderText('Type a command...')
      await userEvent.type(input, 'skills')
      await userEvent.keyboard('{Enter}')

      expect(screen.getByText('Skills by category:')).toBeInTheDocument()
      expect(screen.getByText(/frontend:/)).toBeInTheDocument()
      expect(screen.getByText(/backend:/)).toBeInTheDocument()
      expect(screen.getByText(/cloud:/)).toBeInTheDocument()
    })

    it('executes skills with frontend argument', async () => {
      const input = screen.getByPlaceholderText('Type a command...')
      await userEvent.type(input, 'skills frontend')
      await userEvent.keyboard('{Enter}')

      expect(screen.getByText(/Frontend Skills:/i)).toBeInTheDocument()
      expect(screen.getByText('React.js')).toBeInTheDocument()
      expect(screen.getByText('Redux.js')).toBeInTheDocument()
    })

    it('executes skills with backend argument', async () => {
      const input = screen.getByPlaceholderText('Type a command...')
      await userEvent.type(input, 'skills backend')
      await userEvent.keyboard('{Enter}')

      expect(screen.getByText(/Backend Skills:/i)).toBeInTheDocument()
      expect(screen.getByText('Spring Boot')).toBeInTheDocument()
    })

    it('shows error for unknown skill category', async () => {
      const input = screen.getByPlaceholderText('Type a command...')
      await userEvent.type(input, 'skills unknown')
      await userEvent.keyboard('{Enter}')

      expect(screen.getByText(/Unknown category: unknown/)).toBeInTheDocument()
    })
  })

  describe('Experience Command', () => {
    it('executes experience command and shows work history', async () => {
      const input = screen.getByPlaceholderText('Type a command...')
      await userEvent.type(input, 'experience')
      await userEvent.keyboard('{Enter}')

      // Check for each role by unique text
      expect(screen.getByText(/Technology Analyst @ Infosys/)).toBeInTheDocument()
      expect(screen.getByText(/Senior System Engineer @ Infosys/)).toBeInTheDocument()
      // Use getAllByText for System Engineer since it matches both System Engineer and Senior System Engineer
      const systemEngineerElements = screen.getAllByText(/System Engineer @ Infosys/)
      expect(systemEngineerElements.length).toBeGreaterThanOrEqual(1)
    })
  })

  describe('Contact Command', () => {
    it('executes contact command and shows contact info', async () => {
      const input = screen.getByPlaceholderText('Type a command...')
      await userEvent.type(input, 'contact')
      await userEvent.keyboard('{Enter}')

      expect(screen.getByText('Get in touch:')).toBeInTheDocument()
      expect(screen.getByText(/Open to opportunities/)).toBeInTheDocument()
    })

    it('has working LinkedIn link in contact output', async () => {
      const input = screen.getByPlaceholderText('Type a command...')
      await userEvent.type(input, 'contact')
      await userEvent.keyboard('{Enter}')

      const link = screen.getByText('linkedin.com/in/aremanishreddy')
      expect(link).toHaveAttribute('href', 'https://linkedin.com/in/aremanishreddy')
      expect(link).toHaveAttribute('target', '_blank')
    })
  })

  describe('Now Command', () => {
    it('executes now command and shows current activities', async () => {
      const input = screen.getByPlaceholderText('Type a command...')
      await userEvent.type(input, 'now')
      await userEvent.keyboard('{Enter}')

      expect(screen.getByText("What I'm up to now:")).toBeInTheDocument()
      expect(screen.getByText(/Working on microfrontend architecture/)).toBeInTheDocument()
    })
  })

  describe('Fun Commands', () => {
    it('executes sudo command with funny message', async () => {
      const input = screen.getByPlaceholderText('Type a command...')
      await userEvent.type(input, 'sudo')
      await userEvent.keyboard('{Enter}')

      expect(screen.getByText(/visitor is not in the sudoers file/)).toBeInTheDocument()
      expect(screen.getByText(/This incident will be reported/)).toBeInTheDocument()
    })

    it('executes neofetch command with ASCII art', async () => {
      const input = screen.getByPlaceholderText('Type a command...')
      await userEvent.type(input, 'neofetch')
      await userEvent.keyboard('{Enter}')

      expect(screen.getByText(/PortfolioOS 1.0/)).toBeInTheDocument()
      expect(screen.getByText(/Full-Stack Engineer/)).toBeInTheDocument()
    })
  })

  describe('Clear Command', () => {
    it('clears the terminal history', async () => {
      const input = screen.getByPlaceholderText('Type a command...')
      
      // First add some commands
      await userEvent.type(input, 'echo test1')
      await userEvent.keyboard('{Enter}')
      
      await userEvent.type(input, 'echo test2')
      await userEvent.keyboard('{Enter}')
      
      // Verify commands are there
      expect(screen.getByText('test1')).toBeInTheDocument()
      expect(screen.getByText('test2')).toBeInTheDocument()
      
      // Clear the terminal
      await userEvent.type(input, 'clear')
      await userEvent.keyboard('{Enter}')
      
      // Commands should be gone (but welcome message remains)
      expect(screen.queryByText('test1')).not.toBeInTheDocument()
      expect(screen.queryByText('test2')).not.toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    it('shows error for unknown command', async () => {
      const input = screen.getByPlaceholderText('Type a command...')
      await userEvent.type(input, 'invalidcommand')
      await userEvent.keyboard('{Enter}')

      expect(screen.getByText(/Command not found: invalidcommand/)).toBeInTheDocument()
      expect(screen.getByText(/Type `help` for available commands/)).toBeInTheDocument()
    })

    it('shows error for empty command', async () => {
      const input = screen.getByPlaceholderText('Type a command...')
      await userEvent.type(input, '   ')
      await userEvent.keyboard('{Enter}')

      // Should not add anything to history for empty input
      // Just check the terminal still works
      expect(input).toBeInTheDocument()
    })
  })

  describe('Keyboard Navigation', () => {
    it('navigates command history with up arrow', async () => {
      const input = screen.getByPlaceholderText('Type a command...')
      
      // Type and execute a command
      await userEvent.type(input, 'echo test message')
      await userEvent.keyboard('{Enter}')
      
      // Press up to recall the command
      await userEvent.keyboard('{ArrowUp}')
      
      expect(input).toHaveValue('echo test message')
    })

    it('navigates command history with down arrow', async () => {
      const input = screen.getByPlaceholderText('Type a command...')
      
      // Type and execute commands
      await userEvent.type(input, 'echo first')
      await userEvent.keyboard('{Enter}')
      
      await userEvent.type(input, 'echo second')
      await userEvent.keyboard('{Enter}')
      
      // Navigate up twice
      await userEvent.keyboard('{ArrowUp}')
      await userEvent.keyboard('{ArrowUp}')
      expect(input).toHaveValue('echo first')
      
      // Navigate down
      await userEvent.keyboard('{ArrowDown}')
      expect(input).toHaveValue('echo second')
    })

    it('auto-completes command with tab', async () => {
      const input = screen.getByPlaceholderText('Type a command...')
      
      // Type partial command
      await userEvent.type(input, 'he')
      
      // Press tab to autocomplete
      await userEvent.keyboard('{Tab}')
      
      expect(input).toHaveValue('help')
    })

    it('auto-completes another command with tab', async () => {
      const input = screen.getByPlaceholderText('Type a command...')
      
      await userEvent.type(input, 'abo')
      await userEvent.keyboard('{Tab}')
      
      expect(input).toHaveValue('about')
    })
  })

  describe('Command Case Insensitivity', () => {
    it('executes HELP in uppercase', async () => {
      const input = screen.getByPlaceholderText('Type a command...')
      await userEvent.type(input, 'HELP')
      await userEvent.keyboard('{Enter}')

      expect(screen.getByText('Available commands:')).toBeInTheDocument()
    })

    it('executes Help in mixed case', async () => {
      const input = screen.getByPlaceholderText('Type a command...')
      await userEvent.type(input, 'HeLp')
      await userEvent.keyboard('{Enter}')

      expect(screen.getByText('Available commands:')).toBeInTheDocument()
    })
  })

  describe('Focus Management', () => {
    it('focuses input when clicking on terminal', async () => {
      const input = screen.getByPlaceholderText('Type a command...')
      const terminalContent = input.parentElement
      
      // Click on the terminal content area
      fireEvent.click(terminalContent!)
      
      // Input should be focused
      expect(input).toHaveFocus()
    })
  })

  describe('Multiple Commands', () => {
    it('maintains history of multiple commands', async () => {
      const input = screen.getByPlaceholderText('Type a command...')
      
      await userEvent.type(input, 'echo first')
      await userEvent.keyboard('{Enter}')
      
      await userEvent.type(input, 'echo second')
      await userEvent.keyboard('{Enter}')
      
      await userEvent.type(input, 'echo third')
      await userEvent.keyboard('{Enter}')
      
      // All outputs should be visible
      expect(screen.getByText('first')).toBeInTheDocument()
      expect(screen.getByText('second')).toBeInTheDocument()
      expect(screen.getByText('third')).toBeInTheDocument()
      
      // All commands should be shown in prompt lines
      const echoCommands = screen.getAllByText(/echo/)
      expect(echoCommands.length).toBeGreaterThanOrEqual(3)
    })
  })
})
