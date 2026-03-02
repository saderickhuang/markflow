import { useCallback, useMemo } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { languages } from '@codemirror/language-data'
import { EditorView } from '@codemirror/view'
import { githubLight, githubDark } from '@uiw/codemirror-theme-github'

interface EditorProps {
  value: string
  onChange: (value: string) => void
  isDarkMode: boolean
}

function Editor({ value, onChange, isDarkMode }: EditorProps) {
  const handleChange = useCallback((val: string) => {
    onChange(val)
  }, [onChange])

  const extensions = useMemo(() => [
    markdown({ base: markdownLanguage, codeLanguages: languages }),
    EditorView.lineWrapping
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
        highlightActiveLine: false,
      }}
    />
  )
}

export default Editor
