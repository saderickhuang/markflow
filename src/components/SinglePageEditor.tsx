import { useState, useRef, useCallback, useEffect, useMemo, memo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import CodeMirror from '@uiw/react-codemirror'
import { githubDark, githubLight } from '@uiw/codemirror-theme-github'
import { languages as cmLanguages } from '@codemirror/language-data'
import type { Extension } from '@codemirror/state'

// ─── Types ─────────────────────────────────────────────────

interface LineElement {
  type: 'line'
  lineIndex: number
  content: string
}

interface CodeBlockElement {
  type: 'code-block'
  startLine: number
  endLine: number
  language: string
  code: string
}

type Element = LineElement | CodeBlockElement

type ActiveState =
  | null
  | { type: 'line'; lineIndex: number; cursorPos?: number }
  | { type: 'code-block'; startLine: number }

interface SinglePageEditorProps {
  value: string
  onChange: (value: string) => void
  isDarkMode: boolean
}

// ─── Common languages for code block selector ──────────────

const COMMON_LANGUAGES = [
  '', 'javascript', 'typescript', 'python', 'java', 'c', 'cpp', 'csharp',
  'go', 'rust', 'ruby', 'php', 'swift', 'kotlin', 'scala',
  'html', 'css', 'scss', 'less',
  'sql', 'bash', 'shell', 'powershell',
  'json', 'yaml', 'toml', 'xml',
  'markdown', 'dockerfile', 'graphql', 'r', 'lua', 'perl', 'haskell'
]

// ─── Parse content into line / code-block elements ─────────

function parseElements(content: string): Element[] {
  const lines = content.split('\n')
  const elements: Element[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]
    const fenceMatch = line.match(/^(`{3,})(.*)$/)

    if (fenceMatch && !fenceMatch[2].includes('`')) {
      const fence = fenceMatch[1]
      const language = fenceMatch[2].trim()
      const startLine = i
      const codeLines: string[] = []
      i++

      const closingRe = new RegExp(`^\\s*\`{${fence.length},}\\s*$`)
      while (i < lines.length) {
        if (closingRe.test(lines[i])) break
        codeLines.push(lines[i])
        i++
      }

      const endLine = i < lines.length ? i : lines.length - 1
      elements.push({
        type: 'code-block',
        startLine,
        endLine,
        language,
        code: codeLines.join('\n')
      })
      if (i < lines.length) i++
    } else {
      elements.push({ type: 'line', lineIndex: i, content: line })
      i++
    }
  }

  return elements
}

// ─── Load CodeMirror language extension ────────────────────

function useLanguageExtension(language: string): Extension[] {
  const [ext, setExt] = useState<Extension[]>([])

  useEffect(() => {
    if (!language) { setExt([]); return }

    const desc = cmLanguages.find(l =>
      l.name.toLowerCase() === language.toLowerCase() ||
      l.alias.some(a => a.toLowerCase() === language.toLowerCase())
    )

    if (desc) {
      let cancelled = false
      desc.load().then(support => {
        if (!cancelled) setExt([support])
      })
      return () => { cancelled = true }
    } else {
      setExt([])
    }
  }, [language])

  return ext
}

// ─── Line Preview (memoized) ───────────────────────────────

const LinePreview = memo(function LinePreview({
  content,
  isDarkMode
}: {
  content: string
  isDarkMode: boolean
}) {
  if (content.trim() === '') {
    return <div className="single-page-line-blank">&nbsp;</div>
  }

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={{
        h1: ({ children, ...props }) => (
          <h1 className="text-2xl font-bold mt-4 mb-2 pb-1 border-b"
            style={{ borderColor: isDarkMode ? '#444' : '#ddd' }} {...props}>{children}</h1>
        ),
        h2: ({ children, ...props }) => (
          <h2 className="text-xl font-bold mt-3 mb-1 pb-1 border-b"
            style={{ borderColor: isDarkMode ? '#444' : '#ddd' }} {...props}>{children}</h2>
        ),
        h3: ({ children, ...props }) => <h3 className="text-lg font-semibold my-1" {...props}>{children}</h3>,
        h4: ({ children, ...props }) => <h4 className="text-base font-semibold my-1" {...props}>{children}</h4>,
        h5: ({ children, ...props }) => <h5 className="text-sm font-semibold my-0.5" {...props}>{children}</h5>,
        h6: ({ children, ...props }) => <h6 className="text-sm font-medium my-0.5 text-gray-500 dark:text-gray-400" {...props}>{children}</h6>,
        p: ({ children, ...props }) => <p className="my-0 leading-relaxed" {...props}>{children}</p>,
        code: ({ children, className, ...props }: any) => (
          <code className={`${className || ''} px-1.5 py-0.5 rounded text-sm`}
            style={{ backgroundColor: isDarkMode ? '#2d2d2d' : '#f6f8fa' }} {...props}>
            {children}
          </code>
        ),
        a: ({ href, children, ...props }) => (
          <a href={href} target="_blank" rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-600 underline" {...props}>{children}</a>
        ),
        img: ({ src, alt, ...props }) => (
          <img src={src} alt={alt || ''} className="max-w-full h-auto rounded my-1" loading="lazy" {...props} />
        ),
        blockquote: ({ children, ...props }) => (
          <blockquote className="border-l-4 pl-4 py-0.5 italic"
            style={{ borderColor: isDarkMode ? '#555' : '#ddd', color: isDarkMode ? '#999' : '#666' }}
            {...props}>{children}</blockquote>
        ),
        input: ({ type, checked, ...props }: any) => {
          if (type === 'checkbox') {
            return <input type="checkbox" checked={checked} readOnly className="mr-2 h-4 w-4" {...props} />
          }
          return <input type={type} {...props} />
        },
        ul: ({ children, className, ...props }: any) => {
          const isTaskList = className?.includes('contains-task-list')
          return <ul className={`${isTaskList ? 'list-none pl-4' : 'list-disc pl-6'} my-0`} {...props}>{children}</ul>
        },
        ol: ({ children, ...props }) => <ol className="list-decimal pl-6 my-0" {...props}>{children}</ol>,
        li: ({ children, ...props }) => <li className="my-0" {...props}>{children}</li>,
        table: ({ children, ...props }) => (
          <div className="overflow-x-auto my-1">
            <table className="min-w-full border-collapse" {...props}>{children}</table>
          </div>
        ),
        th: ({ children, ...props }) => (
          <th className="border px-4 py-2 text-left font-semibold"
            style={{ backgroundColor: isDarkMode ? '#2d2d2d' : '#f6f8fa', borderColor: isDarkMode ? '#444' : '#ddd' }}
            {...props}>{children}</th>
        ),
        td: ({ children, ...props }) => (
          <td className="border px-4 py-2" style={{ borderColor: isDarkMode ? '#444' : '#ddd' }} {...props}>{children}</td>
        ),
        hr: ({ ...props }) => (
          <hr className="my-4 border-t" style={{ borderColor: isDarkMode ? '#444' : '#ddd' }} {...props} />
        )
      }}
    >
      {content}
    </ReactMarkdown>
  )
})

// ─── Line Editor (single-line input) ───────────────────────

function LineEditor({
  content,
  cursorPos,
  onUpdate,
  onEnter,
  onBackspaceAtStart,
  onArrowUp,
  onArrowDown,
  onEscape,
}: {
  content: string
  cursorPos?: number
  onUpdate: (value: string) => void
  onEnter: (cursorPos: number) => void
  onBackspaceAtStart: () => void
  onArrowUp: () => void
  onArrowDown: () => void
  onEscape: () => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const el = inputRef.current
    if (!el) return
    el.focus()
    if (cursorPos !== undefined) {
      el.setSelectionRange(cursorPos, cursorPos)
    } else {
      el.setSelectionRange(el.value.length, el.value.length)
    }
  }, [])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    const el = e.currentTarget

    if (e.key === 'Enter') {
      e.preventDefault()
      onEnter(el.selectionStart || 0)
      return
    }

    if (e.key === 'Backspace' && el.selectionStart === 0 && el.selectionEnd === 0) {
      e.preventDefault()
      onBackspaceAtStart()
      return
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault()
      onArrowUp()
      return
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      onArrowDown()
      return
    }

    if (e.key === 'Escape') {
      e.preventDefault()
      onEscape()
      return
    }
  }, [onEnter, onBackspaceAtStart, onArrowUp, onArrowDown, onEscape])

  return (
    <input
      ref={inputRef}
      type="text"
      value={content}
      onChange={e => onUpdate(e.target.value)}
      onKeyDown={handleKeyDown}
      className="single-page-line-input"
      spellCheck={false}
    />
  )
}

// ─── Code Block Preview (with copy button) ─────────────────

const CodeBlockPreview = memo(function CodeBlockPreview({
  language,
  code,
  isDarkMode,
  style,
}: {
  language: string
  code: string
  isDarkMode: boolean
  style: any
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [code])

  return (
    <div className="relative group">
      {language && (
        <span className="absolute top-2 left-3 text-xs opacity-50 font-mono select-none z-10">
          {language}
        </span>
      )}
      <button
        onClick={handleCopy}
        onMouseDown={e => e.stopPropagation()}
        className={`absolute top-2 right-2 px-2 py-1 rounded text-xs z-10 transition-opacity
          opacity-0 group-hover:opacity-100
          ${isDarkMode
            ? 'bg-gray-600 text-gray-200 hover:bg-gray-500'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        title="复制代码"
      >
        {copied ? '✓ 已复制' : '复制'}
      </button>
      <SyntaxHighlighter
        style={style}
        language={language || 'text'}
        PreTag="div"
        customStyle={{
          borderRadius: '6px',
          margin: '4px 0',
          paddingTop: language ? '32px' : '16px'
        }}
      >
        {code || ' '}
      </SyntaxHighlighter>
    </div>
  )
})

// ─── Code Block Editor (CodeMirror + language selector) ────

function CodeBlockEditor({
  language,
  code,
  isDarkMode,
  onCodeChange,
  onLanguageChange,
}: {
  language: string
  code: string
  isDarkMode: boolean
  onCodeChange: (code: string) => void
  onLanguageChange: (lang: string) => void
}) {
  const langExt = useLanguageExtension(language)
  const theme = useMemo(() => isDarkMode ? githubDark : githubLight, [isDarkMode])

  return (
    <div className={`single-page-code-editor rounded-md overflow-hidden border ${
      isDarkMode ? 'border-gray-600' : 'border-gray-300'
    }`}>
      <div className={`flex items-center justify-between px-3 py-1.5 text-xs ${
        isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'
      }`}>
        <select
          value={language}
          onChange={e => onLanguageChange(e.target.value)}
          onMouseDown={e => e.stopPropagation()}
          className={`bg-transparent border rounded px-2 py-0.5 text-xs outline-none cursor-pointer ${
            isDarkMode ? 'border-gray-600 text-gray-300' : 'border-gray-300 text-gray-600'
          }`}
        >
          {COMMON_LANGUAGES.map(l => (
            <option key={l} value={l}>{l || 'plain text'}</option>
          ))}
        </select>
        <span className="opacity-50 select-none">代码块</span>
      </div>
      <CodeMirror
        value={code}
        onChange={onCodeChange}
        theme={theme}
        extensions={langExt}
        basicSetup={{
          lineNumbers: true,
          foldGutter: false,
          highlightActiveLine: true,
          autocompletion: false,
        }}
        minHeight="40px"
        style={{ fontSize: '14px' }}
        autoFocus
      />
    </div>
  )
}

// ─── Main SinglePageEditor ─────────────────────────────────

function SinglePageEditor({ value, onChange, isDarkMode }: SinglePageEditorProps) {
  const [active, setActive] = useState<ActiveState>(null)
  const switchingRef = useRef(false)

  const elements = useMemo(() => parseElements(value), [value])
  const highlightStyle = useMemo(() => isDarkMode ? oneDark : oneLight, [isDarkMode])

  const linesRef = useRef<string[]>([])
  linesRef.current = value.split('\n')

  // ─── Activation helpers ──────────────────────────────────

  const activateLine = useCallback((lineIndex: number, cursorPos?: number) => {
    switchingRef.current = true
    setActive({ type: 'line', lineIndex, cursorPos })
    requestAnimationFrame(() => { switchingRef.current = false })
  }, [])

  const activateCodeBlock = useCallback((startLine: number) => {
    switchingRef.current = true
    setActive({ type: 'code-block', startLine })
    requestAnimationFrame(() => { switchingRef.current = false })
  }, [])

  const deactivate = useCallback(() => {
    if (!switchingRef.current) setActive(null)
  }, [])

  // ─── Line editing handlers ───────────────────────────────

  const updateLine = useCallback((lineIndex: number, newContent: string) => {
    // Auto-complete code block when user types just backticks (```)
    if (/^`{3,}$/.test(newContent)) {
      const lines = [...linesRef.current]
      lines.splice(lineIndex, 1, newContent, '', newContent)
      linesRef.current = lines
      onChange(lines.join('\n'))
      activateCodeBlock(lineIndex)
      return
    }

    const lines = [...linesRef.current]
    lines[lineIndex] = newContent
    linesRef.current = lines
    onChange(lines.join('\n'))
  }, [onChange, activateCodeBlock])

  const handleLineEnter = useCallback((lineIndex: number, cursorPos: number) => {
    const line = linesRef.current[lineIndex]

    // Code block with language: ```lang + Enter
    const fenceMatch = line.match(/^(`{3,})(\w+)$/)
    if (fenceMatch) {
      const fence = fenceMatch[1]
      const lines = [...linesRef.current]
      lines.splice(lineIndex, 1, line, '', fence)
      linesRef.current = lines
      onChange(lines.join('\n'))
      activateCodeBlock(lineIndex)
      return
    }

    // Split line at cursor
    const before = line.substring(0, cursorPos)
    const after = line.substring(cursorPos)
    const lines = [...linesRef.current]
    lines.splice(lineIndex, 1, before, after)
    linesRef.current = lines
    onChange(lines.join('\n'))
    activateLine(lineIndex + 1, 0)
  }, [onChange, activateCodeBlock, activateLine])

  const handleBackspaceAtStart = useCallback((lineIndex: number) => {
    if (lineIndex === 0) return

    // Don't merge into a code block
    const prevIsCodeBlock = elements.some(el =>
      el.type === 'code-block' && lineIndex - 1 >= el.startLine && lineIndex - 1 <= el.endLine
    )
    if (prevIsCodeBlock) return

    const lines = [...linesRef.current]
    const prevLen = lines[lineIndex - 1].length
    lines[lineIndex - 1] = lines[lineIndex - 1] + lines[lineIndex]
    lines.splice(lineIndex, 1)
    linesRef.current = lines
    onChange(lines.join('\n'))
    activateLine(lineIndex - 1, prevLen)
  }, [onChange, elements, activateLine])

  const navigateUp = useCallback((fromLineIndex: number) => {
    for (let i = elements.length - 1; i >= 0; i--) {
      const el = elements[i]
      if (el.type === 'line' && el.lineIndex < fromLineIndex) {
        activateLine(el.lineIndex)
        return
      }
      if (el.type === 'code-block' && el.endLine < fromLineIndex) {
        activateCodeBlock(el.startLine)
        return
      }
    }
  }, [elements, activateLine, activateCodeBlock])

  const navigateDown = useCallback((fromLineIndex: number) => {
    for (const el of elements) {
      if (el.type === 'line' && el.lineIndex > fromLineIndex) {
        activateLine(el.lineIndex)
        return
      }
      if (el.type === 'code-block' && el.startLine > fromLineIndex) {
        activateCodeBlock(el.startLine)
        return
      }
    }
  }, [elements, activateLine, activateCodeBlock])

  // ─── Code block handlers ─────────────────────────────────

  const updateCodeBlock = useCallback((startLine: number, endLine: number, language: string, newCode: string) => {
    const lines = [...linesRef.current]
    const newLines = ['```' + language, ...newCode.split('\n'), '```']
    lines.splice(startLine, endLine - startLine + 1, ...newLines)
    linesRef.current = lines
    onChange(lines.join('\n'))
  }, [onChange])

  // ─── Render ──────────────────────────────────────────────

  return (
    <div
      className="h-full overflow-auto p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) setActive(null)
      }}
    >
      <div className={`preview-content max-w-3xl mx-auto ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
        {elements.map((el) => {
          if (el.type === 'code-block') {
            const isActive = active?.type === 'code-block' && active.startLine === el.startLine
            return (
              <div
                key={`cb-${el.startLine}`}
                className="my-2"
                onMouseDown={(e) => {
                  e.stopPropagation()
                  if (!isActive) activateCodeBlock(el.startLine)
                }}
              >
                {isActive ? (
                  <CodeBlockEditor
                    language={el.language}
                    code={el.code}
                    isDarkMode={isDarkMode}
                    onCodeChange={code => updateCodeBlock(el.startLine, el.endLine, el.language, code)}
                    onLanguageChange={lang => updateCodeBlock(el.startLine, el.endLine, lang, el.code)}
                  />
                ) : (
                  <CodeBlockPreview
                    language={el.language}
                    code={el.code}
                    isDarkMode={isDarkMode}
                    style={highlightStyle}
                  />
                )}
              </div>
            )
          }

          // Line element
          const isActive = active?.type === 'line' && active.lineIndex === el.lineIndex
          return (
            <div
              key={`line-${el.lineIndex}`}
              className="single-page-line"
              onMouseDown={(e) => {
                e.stopPropagation()
                if (!isActive) activateLine(el.lineIndex)
              }}
            >
              {isActive ? (
                <LineEditor
                  content={el.content}
                  cursorPos={active.type === 'line' ? active.cursorPos : undefined}
                  onUpdate={val => updateLine(el.lineIndex, val)}
                  onEnter={pos => handleLineEnter(el.lineIndex, pos)}
                  onBackspaceAtStart={() => handleBackspaceAtStart(el.lineIndex)}
                  onArrowUp={() => navigateUp(el.lineIndex)}
                  onArrowDown={() => navigateDown(el.lineIndex)}
                  onEscape={deactivate}
                />
              ) : (
                <LinePreview content={el.content} isDarkMode={isDarkMode} />
              )}
            </div>
          )
        })}

        {/* Bottom area for adding new content */}
        <div
          className="min-h-[200px] cursor-text"
          onMouseDown={(e) => {
            e.stopPropagation()
            const lastIdx = linesRef.current.length - 1
            if (linesRef.current[lastIdx]?.trim() !== '') {
              const lines = [...linesRef.current, '']
              linesRef.current = lines
              onChange(lines.join('\n'))
              setActive({ type: 'line', lineIndex: lastIdx + 1 })
            } else {
              setActive({ type: 'line', lineIndex: lastIdx })
            }
          }}
        />
      </div>
    </div>
  )
}

export default SinglePageEditor
