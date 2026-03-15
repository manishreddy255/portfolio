# Testing Guide

This project uses **Vitest** for unit testing with **React Testing Library** for component testing.

## Test Setup

### Installed Packages

- `vitest` - Test runner (Vite-native)
- `@testing-library/react` - React component testing utilities
- `@testing-library/jest-dom` - Custom DOM matchers
- `@testing-library/user-event` - User interaction simulation
- `jsdom` - DOM environment for tests

### Configuration Files

- `vitest.config.ts` - Vitest configuration
- `src/test/setup.ts` - Test setup and global mocks

## Running Tests

```bash
# Run tests in watch mode (for development)
npm run test

# Run tests once (for CI/CD)
npm run test:run

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## Test Structure

```
src/
├── components/
│   ├── Terminal.tsx
│   └── Terminal.test.tsx      # Component tests
├── App.tsx
├── App.test.tsx               # App integration tests
└── test/
    └── setup.ts               # Test configuration & mocks
```

## Writing Tests

### Basic Component Test

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MyComponent } from './MyComponent'

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})
```

### Testing User Interactions

```typescript
import userEvent from '@testing-library/user-event'

it('handles button click', async () => {
  render(<MyComponent />)
  const button = screen.getByRole('button', { name: 'Click me' })
  await userEvent.click(button)
  expect(screen.getByText('Clicked!')).toBeInTheDocument()
})
```

### Testing Form Input

```typescript
it('accepts text input', async () => {
  render(<MyComponent />)
  const input = screen.getByPlaceholderText('Type here...')
  await userEvent.type(input, 'Hello World')
  expect(input).toHaveValue('Hello World')
})
```

### Testing Keyboard Events

```typescript
it('handles keyboard navigation', async () => {
  render(<MyComponent />)
  const input = screen.getByRole('textbox')
  
  await userEvent.type(input, 'test')
  await userEvent.keyboard('{Enter}')
  await userEvent.keyboard('{ArrowUp}')
  
  expect(input).toHaveValue('previous value')
})
```

## Available Matchers

From `@testing-library/jest-dom`:

```typescript
// Visibility
expect(element).toBeInTheDocument()
expect(element).toBeVisible()
expect(element).toBeHidden()

// Content
expect(element).toHaveTextContent('Hello')
expect(element).toContainHTML('<span>')

// Form elements
expect(input).toHaveValue('test')
expect(checkbox).toBeChecked()
expect(button).toBeDisabled()

// Attributes
expect(link).toHaveAttribute('href', '/path')
expect(element).toHaveClass('active')

// Style
expect(element).toHaveStyle('color: rgb(255, 0, 0)')
```

## Mocking

### Mocking Browser APIs

The `setup.ts` file includes mocks for:

```typescript
// matchMedia
window.matchMedia = vi.fn()

// IntersectionObserver
window.IntersectionObserver = vi.fn()

// scrollTo
window.scrollTo = vi.fn()

// scrollIntoView
Element.prototype.scrollIntoView = vi.fn()
```

### Mocking Modules

```typescript
import { vi } from 'vitest'

vi.mock('@/lib/utils', () => ({
  cn: (...classes: string[]) => classes.join(' ')
}))
```

### Mocking Functions

```typescript
const mockFn = vi.fn()
mockFn.mockReturnValue('mocked value')
mockFn.mockResolvedValue({ data: [] })

expect(mockFn).toHaveBeenCalled()
expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2')
expect(mockFn).toHaveBeenCalledTimes(2)
```

## Best Practices

### 1. Test Behavior, Not Implementation

```typescript
// Good - tests what user sees
expect(screen.getByText('Submit')).toBeInTheDocument()

// Bad - tests implementation details
expect(component.state.isOpen).toBe(true)
```

### 2. Use Semantic Queries

Priority order for queries:
1. `getByRole` - most preferred
2. `getByLabelText` - for form elements
3. `getByPlaceholderText` - for inputs
4. `getByText` - for text content
5. `getByTestId` - last resort

```typescript
// Good
screen.getByRole('button', { name: 'Submit' })
screen.getByLabelText('Email')

// Avoid if possible
screen.getByTestId('submit-button')
```

### 3. Handle Async Operations

```typescript
import { waitFor } from '@testing-library/react'

// Wait for element to appear
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument()
})

// Or use findBy (combines getBy + waitFor)
const element = await screen.findByText('Loaded')
```

### 4. Clean Up After Tests

```typescript
import { cleanup } from '@testing-library/react'

afterEach(() => {
  cleanup()
})
```

This is already configured in `setup.ts`.

### 5. Group Related Tests

```typescript
describe('Terminal', () => {
  describe('Command Execution', () => {
    it('executes help command', () => {})
    it('executes about command', () => {})
  })

  describe('Keyboard Navigation', () => {
    it('handles arrow keys', () => {})
    it('handles tab completion', () => {})
  })
})
```

## Current Test Coverage

### Terminal Component Tests (30 tests)

- Initial render
- Basic command execution (help, about, whoami, date, echo)
- Skills command with arguments
- Experience command
- Contact command
- Now command
- Fun commands (sudo, neofetch)
- Clear command
- Error handling
- Keyboard navigation (arrow keys, tab)
- Command history
- Case insensitivity
- Focus management
- Multiple commands

### App Component Tests (39 tests)

- Navigation rendering
- Hero section
- About section
- Experience section
- Terminal section integration
- Skills section
- Contact section
- Footer
- Smooth scrolling navigation
- Terminal integration in App
- Accessibility

## Debugging Tests

### View Test Output

```bash
# Run with verbose output
npm run test:run -- --reporter=verbose

# Run specific test file
npm run test:run -- src/components/Terminal.test.tsx

# Run specific test
npm run test:run -- -t "executes help command"
```

### Debug in Browser

```bash
# Open Vitest UI
npm run test:ui
```

### Using `screen.debug()`

```typescript
it('shows component structure', () => {
  render(<MyComponent />)
  screen.debug() // Prints DOM to console
})
```

### Using `logRoles()`

```typescript
import { logRoles } from '@testing-library/react'

it('shows accessible roles', () => {
  const { container } render(<MyComponent />)
  logRoles(container)
})
```

## Continuous Integration

Tests run automatically on:
- Pull requests
- Pushes to main branch

GitHub Actions workflow should include:

```yaml
- name: Run tests
  run: npm run test:run
```

## Adding New Tests

When adding new features:

1. Create `ComponentName.test.tsx` alongside the component
2. Test the happy path first
3. Add edge cases
4. Test error states
5. Verify accessibility

Example template:

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NewComponent } from './NewComponent'

describe('NewComponent', () => {
  beforeEach(() => {
    render(<NewComponent />)
  })

  it('renders correctly', () => {
    expect(screen.getByRole('heading')).toBeInTheDocument()
  })

  it('handles user interaction', async () => {
    const button = screen.getByRole('button')
    await userEvent.click(button)
    expect(screen.getByText('Success')).toBeInTheDocument()
  })

  it('is accessible', () => {
    expect(screen.getByRole('button')).toHaveAttribute('aria-label')
  })
})
```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Library Cheatsheet](https://testing-library.com/docs/dom-testing-library/cheatsheet/)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom#custom-matchers)
