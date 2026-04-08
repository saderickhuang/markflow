import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useMemo, useRef, useCallback, useImperativeHandle, forwardRef } from 'react'

export interface PreviewHandle {
  scrollToRatio: (ratio: number) => void
}

interface PreviewProps {
  content: string
  isDarkMode: boolean
  onScroll?: (ratio: number) => void
}

const Preview = forwardRef<PreviewHandle, PreviewProps>(function Preview({ content, isDarkMode, onScroll }, ref) {
  const containerRef = useRef<HTMLDivElement>(null)
  const onScrollRef = useRef(onScroll)
  onScrollRef.current = onScroll

  useImperativeHandle(ref, () => ({
    scrollToRatio: (ratio: number) => {
      const el = containerRef.current
      if (!el) return
      el.scrollTop = ratio * (el.scrollHeight - el.clientHeight)
    }
  }))

  const handleScroll = useCallback(() => {
    const el = containerRef.current
    if (!el) return
    const maxScroll = el.scrollHeight - el.clientHeight
    const ratio = maxScroll > 0 ? el.scrollTop / maxScroll : 0
    onScrollRef.current?.(ratio)
  }, [])

  const style = useMemo(() => 
    isDarkMode ? oneDark : oneLight,
    [isDarkMode]
  )

  return (
    <div ref={containerRef} onScroll={handleScroll} className={`p-4 h-full overflow-auto ${isDarkMode ? 'dark' : ''}`}>
      <div className={`preview-content max-w-3xl mx-auto ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeKatex]}
          components={{
            // Code block rendering with syntax highlighting
            code({ node, inline, className, children, ...props }: any) {
              const match = /language-(\w+)/.exec(className || '')
              const language = match ? match[1] : 'text'
              
              if (!inline && match) {
                return (
                  <SyntaxHighlighter
                    style={style}
                    language={language}
                    PreTag="div"
                    customStyle={{
                      borderRadius: '6px',
                      margin: '16px 0'
                    }}
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                )
              }
              
              return (
                <code 
                  className={`${className} px-1.5 py-0.5 rounded text-sm`} 
                  style={{ 
                    backgroundColor: isDarkMode ? '#2d2d2d' : '#f6f8fa' 
                  }}
                  {...props}
                >
                  {children}
                </code>
              )
            },
            
            // Link rendering - open in new tab
            a({ href, children, ...props }) {
              return (
                <a 
                  href={href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600 underline"
                  {...props}
                >
                  {children}
                </a>
              )
            },
            
            // Image rendering
            img({ src, alt, ...props }) {
              return (
                <img 
                  src={src} 
                  alt={alt || ''} 
                  className="max-w-full h-auto rounded my-2"
                  loading="lazy"
                  {...props}
                />
              )
            },
            
            // Table styling
            table({ children, ...props }) {
              return (
                <div className="overflow-x-auto my-4">
                  <table className="min-w-full border-collapse" {...props}>
                    {children}
                  </table>
                </div>
              )
            },
            
            th({ children, ...props }) {
              return (
                <th 
                  className="border px-4 py-2 text-left font-semibold"
                  style={{ 
                    backgroundColor: isDarkMode ? '#2d2d2d' : '#f6f8fa',
                    borderColor: isDarkMode ? '#444' : '#ddd'
                  }}
                  {...props}
                >
                  {children}
                </th>
              )
            },
            
            td({ children, ...props }) {
              return (
                <td 
                  className="border px-4 py-2"
                  style={{ borderColor: isDarkMode ? '#444' : '#ddd' }}
                  {...props}
                >
                  {children}
                </td>
              )
            },
            
            // Blockquote styling
            blockquote({ children, ...props }) {
              return (
                <blockquote 
                  className="border-l-4 pl-4 py-1 my-4 italic"
                  style={{ 
                    borderColor: isDarkMode ? '#555' : '#ddd',
                    color: isDarkMode ? '#999' : '#666'
                  }}
                  {...props}
                >
                  {children}
                </blockquote>
              )
            },
            
            // Task list checkbox
            input({ type, checked, ...props }) {
              if (type === 'checkbox') {
                return (
                  <input 
                    type="checkbox" 
                    checked={checked} 
                    readOnly 
                    className="mr-2 h-4 w-4"
                    {...props}
                  />
                )
              }
              return <input type={type} {...props} />
            },
            
            // List styling
            ul({ children, ...props }) {
              return <ul className="list-disc pl-6 my-2" {...props}>{children}</ul>
            },
            
            ol({ children, ...props }) {
              return <ol className="list-decimal pl-6 my-2" {...props}>{children}</ol>
            },
            
            li({ children, ...props }) {
              return <li className="my-1" {...props}>{children}</li>
            },
            
            // Heading styling
            h1({ children, ...props }) {
              return <h1 className="text-2xl font-bold my-4 pb-2 border-b" {...props}>{children}</h1>
            },
            
            h2({ children, ...props }) {
              return <h2 className="text-xl font-bold my-3 pb-1 border-b" {...props}>{children}</h2>
            },
            
            h3({ children, ...props }) {
              return <h3 className="text-lg font-semibold my-2" {...props}>{children}</h3>
            },
            
            // Paragraph
            p({ children, ...props }) {
              return <p className="my-2 leading-relaxed" {...props}>{children}</p>
            },
            
            // Horizontal rule
            hr({ ...props }) {
              return <hr className="my-6 border-t" style={{ borderColor: isDarkMode ? '#444' : '#ddd' }} {...props} />
            }
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  )
})

export default Preview
