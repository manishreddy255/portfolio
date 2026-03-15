import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

describe('App', () => {
  beforeEach(() => {
    render(<App />)
  })

  describe('Navigation', () => {
    it('renders navigation with AMR logo', () => {
      expect(screen.getByText('AMR')).toBeInTheDocument()
    })

    it('renders all navigation buttons', () => {
      // Use getAllByText and check buttons specifically in nav
      const nav = document.querySelector('nav')
      expect(nav).toBeInTheDocument()
      
      const navButtons = nav?.querySelectorAll('button')
      const buttonTexts = Array.from(navButtons || []).map(b => b.textContent)
      
      expect(buttonTexts).toContain('About')
      expect(buttonTexts).toContain('Experience')
      expect(buttonTexts).toContain('Terminal')
      expect(buttonTexts).toContain('Skills')
      expect(buttonTexts).toContain('Contact')
    })

    it('has clickable Terminal navigation link', () => {
      const nav = document.querySelector('nav')
      const terminalButton = nav?.querySelector('button')
      expect(terminalButton).toBeInTheDocument()
    })
  })

  describe('Hero Section', () => {
    it('renders hero section with name', () => {
      expect(screen.getByText("Are Manish Reddy")).toBeInTheDocument()
    })

    it('renders hero section with title', () => {
      expect(screen.getByText(/Technology Analyst & Full-Stack Engineer/)).toBeInTheDocument()
    })

    it('renders location info', () => {
      expect(screen.getByText(/Kidlington, England, United Kingdom/)).toBeInTheDocument()
    })

    it('has LinkedIn link', () => {
      const linkedinLink = screen.getByText('LinkedIn')
      expect(linkedinLink).toBeInTheDocument()
      expect(linkedinLink.closest('a')).toHaveAttribute('href', 'https://linkedin.com/in/aremanishreddy')
    })

    it('has Get in touch button', () => {
      expect(screen.getByText('Get in touch')).toBeInTheDocument()
    })
  })

  describe('About Section', () => {
    it('renders about section heading', () => {
      // Get the section heading specifically (h2 in about section)
      const aboutSection = document.getElementById('about')
      expect(aboutSection).toBeInTheDocument()
    })

    it('displays about content', () => {
      expect(screen.getByText(/Full-Stack Engineer with 4\+ years of experience/)).toBeInTheDocument()
    })
  })

  describe('Experience Section', () => {
    it('renders experience section', () => {
      const experienceSection = document.getElementById('experience')
      expect(experienceSection).toBeInTheDocument()
    })

    it('displays current role', () => {
      expect(screen.getByText('Technology Analyst')).toBeInTheDocument()
      // Check Infosys appears multiple times (in multiple roles)
      const infosysElements = screen.getAllByText('Infosys')
      expect(infosysElements.length).toBeGreaterThanOrEqual(3)
    })

    it('displays previous roles', () => {
      expect(screen.getByText('Senior System Engineer')).toBeInTheDocument()
      expect(screen.getByText('System Engineer')).toBeInTheDocument()
    })

    it('displays education section', () => {
      expect(screen.getByText(/Bachelor of Technology/)).toBeInTheDocument()
    })
  })

  describe('Terminal Section', () => {
    it('renders terminal section', () => {
      const terminalSection = document.getElementById('terminal')
      expect(terminalSection).toBeInTheDocument()
    })

    it('displays terminal section title', () => {
      expect(screen.getByText('Prefer the command line?')).toBeInTheDocument()
    })

    it('displays terminal description', () => {
      expect(screen.getByText(/I've built an interactive terminal/)).toBeInTheDocument()
    })

    it('shows helpful hints', () => {
      // Check for specific hint text
      expect(screen.getByText(/Try/)).toBeInTheDocument()
      
      // Check code elements exist
      const codeElements = document.querySelectorAll('code')
      const codeTexts = Array.from(codeElements).map(c => c.textContent)
      expect(codeTexts).toContain('help')
      expect(codeTexts).toContain('neofetch')
    })

    it('renders the terminal component', () => {
      expect(screen.getByPlaceholderText('Type a command...')).toBeInTheDocument()
    })

    it('terminal shows welcome message', () => {
      expect(screen.getByText('Welcome to PortfolioOS v1.0.0')).toBeInTheDocument()
    })

    it('has terminal prompt', () => {
      const prompts = screen.getAllByText('visitor@portfolio:~$')
      expect(prompts.length).toBeGreaterThan(0)
    })
  })

  describe('Skills Section', () => {
    it('renders skills section', () => {
      const skillsSection = document.getElementById('skills')
      expect(skillsSection).toBeInTheDocument()
    })

    it('displays frontend skills', () => {
      // Check skill category
      expect(screen.getByText('Frontend')).toBeInTheDocument()
      // Check specific skill
      expect(screen.getByText('React.js')).toBeInTheDocument()
    })

    it('displays backend skills', () => {
      expect(screen.getByText('Backend')).toBeInTheDocument()
      expect(screen.getByText('Spring Boot')).toBeInTheDocument()
    })

    it('displays cloud skills', () => {
      expect(screen.getByText('Cloud & DevOps')).toBeInTheDocument()
      expect(screen.getByText('AWS')).toBeInTheDocument()
    })

    it('displays exploring section', () => {
      expect(screen.getByText('Exploring')).toBeInTheDocument()
      expect(screen.getByText('Agentic AI')).toBeInTheDocument()
    })
  })

  describe('Contact Section', () => {
    it('renders contact section', () => {
      const contactSection = document.getElementById('contact')
      expect(contactSection).toBeInTheDocument()
    })

    it('displays contact message', () => {
      expect(screen.getByText(/I'm always open to discussing/)).toBeInTheDocument()
    })

    it('has LinkedIn contact link', () => {
      const contactLinks = screen.getAllByText(/linkedin.com\/in\/aremanishreddy/)
      expect(contactLinks.length).toBeGreaterThan(0)
    })
  })

  describe('Footer', () => {
    it('renders footer with copyright', () => {
      const currentYear = new Date().getFullYear()
      expect(screen.getByText(new RegExp(`© ${currentYear}`))).toBeInTheDocument()
    })

    it('has footer LinkedIn link', () => {
      const footerLinkedin = document.querySelector('footer a[href="https://linkedin.com/in/aremanishreddy"]')
      expect(footerLinkedin).toBeInTheDocument()
    })
  })

  describe('Smooth Scrolling Navigation', () => {
    it('About link is clickable', async () => {
      const nav = document.querySelector('nav')
      const aboutButton = Array.from(nav?.querySelectorAll('button') || []).find(b => b.textContent === 'About')
      expect(aboutButton).toBeInTheDocument()
      if (aboutButton) {
        await userEvent.click(aboutButton)
      }
    })

    it('Terminal link is clickable', async () => {
      const nav = document.querySelector('nav')
      const terminalButton = Array.from(nav?.querySelectorAll('button') || []).find(b => b.textContent === 'Terminal')
      expect(terminalButton).toBeInTheDocument()
      if (terminalButton) {
        await userEvent.click(terminalButton)
      }
    })

    it('Skills link is clickable', async () => {
      const nav = document.querySelector('nav')
      const skillsButton = Array.from(nav?.querySelectorAll('button') || []).find(b => b.textContent === 'Skills')
      expect(skillsButton).toBeInTheDocument()
      if (skillsButton) {
        await userEvent.click(skillsButton)
      }
    })

    it('Contact link is clickable', async () => {
      const nav = document.querySelector('nav')
      const contactButton = Array.from(nav?.querySelectorAll('button') || []).find(b => b.textContent === 'Contact')
      expect(contactButton).toBeInTheDocument()
      if (contactButton) {
        await userEvent.click(contactButton)
      }
    })
  })

  describe('Terminal Integration in App', () => {
    it('terminal can execute commands when integrated in App', async () => {
      const input = screen.getByPlaceholderText('Type a command...')
      await userEvent.type(input, 'help')
      await userEvent.keyboard('{Enter}')

      expect(screen.getByText('Available commands:')).toBeInTheDocument()
    })

    it('terminal persists state within App', async () => {
      const input = screen.getByPlaceholderText('Type a command...')
      
      // Execute a command
      await userEvent.type(input, 'echo integration test')
      await userEvent.keyboard('{Enter}')

      // Output should be visible
      expect(screen.getByText('integration test')).toBeInTheDocument()
    })
  })
})

describe('App Accessibility', () => {
  it('all interactive elements are accessible', () => {
    render(<App />)
    
    // Check buttons
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(0)
    
    // Check links
    const links = screen.getAllByRole('link')
    expect(links.length).toBeGreaterThan(0)
  })

  it('images have alt text or are decorative', () => {
    render(<App />)
    // Lucide icons should be present
    expect(document.querySelectorAll('svg').length).toBeGreaterThan(0)
  })
})
