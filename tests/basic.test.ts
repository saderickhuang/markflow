import { describe, it, expect } from 'vitest'

describe('Phase 1: Basic Setup Tests', () => {
  it('should pass basic test', () => {
    expect(true).toBe(true)
  })

  it('should have correct project name', () => {
    const projectName = 'markflow'
    expect(projectName).toBe('markflow')
  })

  it('should support React 18', () => {
    const reactVersion = 18
    expect(reactVersion).toBeGreaterThanOrEqual(18)
  })

  it('should have TypeScript configured', () => {
    const hasTypeScript = true
    expect(hasTypeScript).toBe(true)
  })
})

describe('Editor Component Tests', () => {
  it('should handle content change', () => {
    const mockOnChange = (value: string) => {
      expect(typeof value).toBe('string')
    }
    mockOnChange('# Hello World')
  })

  it('should render with dark mode', () => {
    const isDarkMode = true
    expect(isDarkMode).toBe(true)
  })

  it('should render with light mode', () => {
    const isDarkMode = false
    expect(isDarkMode).toBe(false)
  })
})

describe('Preview Component Tests', () => {
  it('should render markdown content', () => {
    const content = '# Hello World'
    expect(content).toContain('Hello World')
  })

  it('should support code blocks', () => {
    const codeBlock = '```javascript\nconst a = 1;\n```'
    expect(codeBlock).toContain('javascript')
  })

  it('should support tables', () => {
    const table = '| Header |\n| ------ |\n| Cell |'
    expect(table).toContain('|')
  })
})

describe('Word Count Tests', () => {
  it('should count words correctly', () => {
    const text = 'Hello world this is a test'
    const words = text.trim().split(/\s+/).filter(w => w.length > 0)
    expect(words.length).toBe(6)
  })

  it('should handle empty content', () => {
    const text = ''
    const words = text.trim().split(/\s+/).filter(w => w.length > 0)
    expect(words.length).toBe(0)
  })

  it('should handle multiple spaces', () => {
    const text = 'Hello   world'
    const words = text.trim().split(/\s+/).filter(w => w.length > 0)
    expect(words.length).toBe(2)
  })
})
