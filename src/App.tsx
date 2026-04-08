import { useState, useEffect, useCallback, useRef } from 'react'
import DOMPurify from 'dompurify'
import Editor, { EditorHandle } from './components/Editor'
import Preview, { PreviewHandle } from './components/Preview'
import Toolbar from './components/Toolbar'
import StatusBar from './components/StatusBar'
import { createStorageService } from './services/storage'
import { fileService } from './services/file'

const DEFAULT_CONTENT = `# Welcome to MarkFlow

Start writing your Markdown here...

## Features

- **Instant Preview** - See rendered Markdown as you type
- **Split View** - Edit and preview side by side
- **Theme Switching** - Light and dark themes
- **Code Highlighting** - Multi-language support
- **Auto-save** - Your work is automatically saved

## Try it out!

### Text Formatting

**Bold text** and *italic text* and ~~strikethrough~~

### Code

\`\`\`javascript
function hello() {
  console.log("Hello, MarkFlow!");
}
\`\`\`

### Blockquote

> This is a blockquote

### Table

| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |

---

Happy writing! 🚀
`

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}



function App() {
  const [content, setContent] = useState('')
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const [renderDelay] = useState(300)
  const [isSaved, setIsSaved] = useState(true)
  const [lastSavedTime, setLastSavedTime] = useState<string>('')
  const [currentFile, setCurrentFile] = useState<string>('未命名.md')
  
  const storage = useRef(createStorageService()).current
  const autoSaveTimer = useRef<NodeJS.Timeout | null>(null)
  const editorRef = useRef<EditorHandle>(null)
  const previewRef = useRef<PreviewHandle>(null)
  const scrollSourceRef = useRef<'editor' | 'preview' | null>(null)
  const scrollLockTimer = useRef<number>(0)
  
  // Debounced content for rendering
  const debouncedContent = useDebounce(content, renderDelay)
  
  // Load saved content on mount
  useEffect(() => {
    const saved = storage.load()
    if (saved) {
      setContent(saved)
      setIsSaved(true)
      setLastSavedTime('已恢复')
    } else {
      setContent(DEFAULT_CONTENT)
    }
  }, [])
  
  // Calculate word count
  useEffect(() => {
    const words = content.trim().split(/\s+/).filter(w => w.length > 0).length
    setWordCount(words)
  }, [content])
  
  // Auto-save every 3 seconds
  useEffect(() => {
    if (autoSaveTimer.current) {
      clearInterval(autoSaveTimer.current)
    }
    
    autoSaveTimer.current = setInterval(() => {
      if (content) {
        storage.save(content)
        setIsSaved(true)
        const now = new Date()
        setLastSavedTime(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`)
      }
    }, 3000)
    
    return () => {
      if (autoSaveTimer.current) {
        clearInterval(autoSaveTimer.current)
      }
    }
  }, [content, storage])
  
  // Handle content change from editor
  const handleContentChange = useCallback((value: string) => {
    setContent(value)
    setIsSaved(false)
  }, [])
  
  // Handle theme toggle
  const handleThemeToggle = useCallback(() => {
    setIsDarkMode(prev => !prev)
  }, [])
  
  // Handle format - wrap selected text or insert at cursor
  const handleFormat = useCallback((format: string) => {
    if (editorRef.current) {
      editorRef.current.applyFormat(format)
    }
  }, [])
  
  // File operations
  const handleNew = useCallback(() => {
    if (!isSaved) {
      if (!confirm('当前内容未保存，确定要新建文件吗？')) {
        return
      }
    }
    setContent(DEFAULT_CONTENT)
    setCurrentFile('未命名.md')
    setIsSaved(true)
  }, [isSaved])
  
  const handleOpen = useCallback(async () => {
    const result = await fileService.open()
    if (result) {
      setContent(result.content)
      setCurrentFile(result.filename)
      setIsSaved(true)
    }
  }, [])
  
  const handleSave = useCallback(() => {
    storage.save(content)
    setIsSaved(true)
    const now = new Date()
    setLastSavedTime(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`)
  }, [content, storage])
  
  const handleSaveAs = useCallback(async () => {
    const filename = await fileService.saveAs(content)
    if (filename) {
      setCurrentFile(filename)
      setIsSaved(true)
    }
  }, [content])
  
  const handleExportHtml = useCallback(() => {
    // Get the rendered HTML from the preview container
    const previewContainer = document.querySelector('.preview-content')
    if (previewContainer) {
      const renderedHtml = DOMPurify.sanitize(previewContainer.innerHTML)
      const filename = currentFile.replace(/\.md$/, '.html')
      fileService.downloadHtml(renderedHtml, filename)
    }
  }, [currentFile])
  
  const handleExportPdf = useCallback(() => {
    window.print()
  }, [])
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 's':
            e.preventDefault()
            handleSave()
            break
          case 'n':
            e.preventDefault()
            handleNew()
            break
          case 'o':
            e.preventDefault()
            handleOpen()
            break
        }
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleSave, handleNew, handleOpen])
  
  // Electron IPC menu event listeners
  useEffect(() => {
    const api = window.electronAPI
    if (!api) return

    api.onMenuNew(handleNew)
    api.onMenuOpen(handleOpen)
    api.onMenuSave(handleSave)
    api.onMenuExportHtml(handleExportHtml)
    api.onMenuExportPdf(handleExportPdf)

    return () => {
      api.removeAllListeners('menu-new')
      api.removeAllListeners('menu-open')
      api.removeAllListeners('menu-save')
      api.removeAllListeners('menu-export-html')
      api.removeAllListeners('menu-export-pdf')
    }
  }, [handleNew, handleOpen, handleSave, handleExportHtml, handleExportPdf])
  
  // Synchronized scrolling between editor and preview
  const handleEditorScroll = useCallback((ratio: number) => {
    if (scrollSourceRef.current === 'preview') return
    scrollSourceRef.current = 'editor'
    previewRef.current?.scrollToRatio(ratio)
    window.clearTimeout(scrollLockTimer.current)
    scrollLockTimer.current = window.setTimeout(() => {
      scrollSourceRef.current = null
    }, 50)
  }, [])

  const handlePreviewScroll = useCallback((ratio: number) => {
    if (scrollSourceRef.current === 'editor') return
    scrollSourceRef.current = 'preview'
    editorRef.current?.scrollToRatio(ratio)
    window.clearTimeout(scrollLockTimer.current)
    scrollLockTimer.current = window.setTimeout(() => {
      scrollSourceRef.current = null
    }, 50)
  }, [])
  
  return (
    <div className={`h-screen flex flex-col ${isDarkMode ? 'dark' : ''}`}>
      <Toolbar 
        isDarkMode={isDarkMode}
        onThemeToggle={handleThemeToggle}
        onNew={handleNew}
        onOpen={handleOpen}
        onSave={handleSave}
        onSaveAs={handleSaveAs}
        onExportHtml={handleExportHtml}
        onExportPdf={handleExportPdf}
        onFormat={handleFormat}
        isSaved={isSaved}
      />
      <div className="flex-1 flex overflow-hidden">
        <div className="print:hidden w-1/2 border-r border-gray-300 dark:border-gray-700">
          <Editor 
            ref={editorRef}
            value={content} 
            onChange={handleContentChange}
            isDarkMode={isDarkMode}
            onScroll={handleEditorScroll}
          />
        </div>
        <div className="w-1/2 print:w-full overflow-auto">
          <Preview ref={previewRef} content={debouncedContent} isDarkMode={isDarkMode} onScroll={handlePreviewScroll} />
        </div>
      </div>
      <StatusBar 
        wordCount={wordCount} 
        renderDelay={renderDelay}
        filename={currentFile}
        lastSaved={lastSavedTime}
      />
    </div>
  )
}

export default App
