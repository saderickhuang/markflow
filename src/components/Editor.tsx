import { useCallback, useMemo, useEffect } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { languages } from '@codemirror/language-data'
import { EditorView, keymap } from '@codemirror/view'
import { githubLight, githubDark } from '@uiw/codemirror-theme-github'
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands'

interface EditorProps {
  value: string
  onChange: (value: string) => void
  isDarkMode: boolean
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

function Editor({ value, onChange, isDarkMode }: EditorProps) {
  const handleChange = useCallback((val: string) => {
    onChange(val)
  }, [onChange])

  const extensions = useMemo(() => [
    markdown({ base: markdownLanguage, codeLanguages: languages }),
    EditorView.lineWrapping,
    history(),
    keymap.of([...defaultKeymap, ...historyKeymap]),
    customKeymap
  ], [])

  const theme = useMemo(() => 
    isDarkMode ? githubDark : githubLight,
    [isDarkMode]
  )

  return (
    <CodeMirror
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
        history: true,
      }}
    />
  )
}

export default Editor
