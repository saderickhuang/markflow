import { useState, useEffect, useCallback } from 'react'
import Editor from './components/Editor'
import Preview from './components/Preview'
import Toolbar from './components/Toolbar'
import StatusBar from './components/StatusBar'

const DEFAULT_CONTENT = `# Welcome to MarkFlow

Start writing your Markdown here...

## Features

- **Instant Preview** - See rendered Markdown as you type
- **Split View** - Edit and preview side by side
- **Theme Switching** - Light and dark themes
- **Code Highlighting** - Multi-language support

## Try it out!

### Text Formatting

**Bold text** and *italic text* and ~~strikethrough~~

### Lists

- Item 1
- Item 2
  - Nested item

### Code

\`\`\`javascript
function hello() {
  console.log("Hello, MarkFlow!");
}
\`\`\`

### Blockquote

> This is a blockquote
> Multiple lines

### Table

| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |

---

Happy writing! 🚀
`

function App() {
  const [content, setContent] = useState(DEFAULT_CONTENT)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [wordCount, setWordCount] = useState(0)

  // Calculate word count
  useEffect(() => {
    const words = content.trim().split(/\s+/).filter(w => w.length > 0).length
    setWordCount(words)
  }, [content])

  // Handle content change from editor
  const handleContentChange = useCallback((value: string) => {
    setContent(value)
  }, [])

  // Handle theme toggle
  const handleThemeToggle = useCallback(() => {
    setIsDarkMode(prev => !prev)
  }, [])

  return (
    <div className={`h-screen flex flex-col ${isDarkMode ? 'dark' : ''}`}>
      <Toolbar 
        isDarkMode={isDarkMode}
        onThemeToggle={handleThemeToggle}
      />
      <div className="flex-1 flex overflow-hidden">
        <div className="w-1/2 border-r border-gray-300 dark:border-gray-700">
          <Editor 
            value={content} 
            onChange={handleContentChange}
            isDarkMode={isDarkMode}
          />
        </div>
        <div className="w-1/2 overflow-auto">
          <Preview content={content} isDarkMode={isDarkMode} />
        </div>
      </div>
      <StatusBar wordCount={wordCount} />
    </div>
  )
}

export default App
