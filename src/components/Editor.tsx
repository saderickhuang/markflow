import { useCallback, useMemo, useRef, useImperativeHandle, forwardRef } from 'react'
import CodeMirror, { ReactCodeMirrorRef } from '@uiw/react-codemirror'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { languages } from '@codemirror/language-data'
import { EditorView, keymap } from '@codemirror/view'
import { githubLight, githubDark } from '@uiw/codemirror-theme-github'
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands'

export interface EditorHandle {
  insertAtCursor: (text: string) => void
  scrollToRatio: (ratio: number) => void
}

interface EditorProps {
  value: string
  onChange: (value: string) => void
  isDarkMode: boolean
  onScroll?: (ratio: number) => void
}

// Custom keyboard shortcuts
const customKeymap = EditorView.domEventHandlers({
  keydown: (event, view) => {
    if (event.ctrlKey || event.metaKey) {
      const state = view.state
      const selection = state.selection.main
      const selectedText = state.doc.sliceString(selection.from, selection.to)
      
      let insert = ''
      switch (event.key) {
        case 'b': // Bold
          event.preventDefault()
          insert = `**${selectedText || 'bold text'}**`
          break
        case 'i': // Italic
          event.preventDefault()
          insert = `*${selectedText || 'italic text'}*`
          break
        case 'k': // Link
          event.preventDefault()
          insert = `[${selectedText || 'link text'}](url)`
          break
        default:
          return false
      }
      
      if (insert) {
        view.dispatch({
          changes: { from: selection.from, to: selection.to, insert },
          selection: { anchor: selection.from + insert.length }
        })
        return true
      }
    }
    return false
  }
})

const Editor = forwardRef<EditorHandle, EditorProps>(function Editor({ value, onChange, isDarkMode, onScroll }, ref) {
  const cmRef = useRef<ReactCodeMirrorRef>(null)
  const onScrollRef = useRef(onScroll)
  onScrollRef.current = onScroll

  useImperativeHandle(ref, () => ({
    insertAtCursor: (text: string) => {
      const view = cmRef.current?.view
      if (!view) return
      const { from, to } = view.state.selection.main
      view.dispatch({
        changes: { from, to, insert: text },
        selection: { anchor: from + text.length }
      })
      view.focus()
    },
    scrollToRatio: (ratio: number) => {
      const view = cmRef.current?.view
      if (!view) return
      const { scrollHeight, clientHeight } = view.scrollDOM
      view.scrollDOM.scrollTop = ratio * (scrollHeight - clientHeight)
    }
  }))

  const handleChange = useCallback((val: string) => {
    onChange(val)
  }, [onChange])

  const scrollListener = useMemo(() =>
    EditorView.domEventHandlers({
      scroll: (_event, view) => {
        const { scrollTop, scrollHeight, clientHeight } = view.scrollDOM
        const maxScroll = scrollHeight - clientHeight
        const ratio = maxScroll > 0 ? scrollTop / maxScroll : 0
        onScrollRef.current?.(ratio)
        return false
      }
    }),
  [])

  const extensions = useMemo(() => [
    markdown({ base: markdownLanguage, codeLanguages: languages }),
    EditorView.lineWrapping,
    history(),
    keymap.of([...defaultKeymap, ...historyKeymap]),
    customKeymap,
    scrollListener
  ], [scrollListener])

  const theme = useMemo(() => 
    isDarkMode ? githubDark : githubLight,
    [isDarkMode]
  )

  return (
    <CodeMirror
      ref={cmRef}
      value={value}
      height="100%"
      theme={theme}
      extensions={extensions}
      onChange={handleChange}
      className="h-full text-base"
      basicSetup={{
        lineNumbers: false,
        foldGutter: false,
        highlightActiveLine: true,
        history: false,
      }}
    />
  )
})

export default Editor
