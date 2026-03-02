interface ToolbarProps {
  isDarkMode: boolean
  onThemeToggle: () => void
  onNew: () => void
  onOpen: () => void
  onSave: () => void
  onSaveAs: () => void
  onExportHtml: () => void
  onExportPdf: () => void
  isSaved?: boolean
}

function Toolbar({ 
  isDarkMode, 
  onThemeToggle,
  onNew,
  onOpen,
  onSave,
  onSaveAs,
  onExportHtml,
  onExportPdf,
  isSaved = true
}: ToolbarProps) {
  return (
    <div className={`flex items-center justify-between px-4 py-2 border-b ${
      isDarkMode 
        ? 'bg-gray-800 border-gray-700 text-gray-200' 
        : 'bg-gray-100 border-gray-300 text-gray-800'
    }`}>
      <div className="flex items-center gap-2">
        <h1 className="text-lg font-semibold mr-4">MarkFlow</h1>
        
        {/* File Operations */}
        <div className="flex items-center gap-1">
          <button
            onClick={onNew}
            className={`px-2 py-1 rounded text-sm transition-colors ${
              isDarkMode
                ? 'hover:bg-gray-700'
                : 'hover:bg-gray-200'
            }`}
            title="New (Ctrl+N)"
          >
            新建
          </button>
          <button
            onClick={onOpen}
            className={`px-2 py-1 rounded text-sm transition-colors ${
              isDarkMode
                ? 'hover:bg-gray-700'
                : 'hover:bg-gray-200'
            }`}
            title="Open (Ctrl+O)"
          >
            打开
          </button>
          <button
            onClick={onSave}
            className={`px-2 py-1 rounded text-sm transition-colors ${
              isDarkMode
                ? 'hover:bg-gray-700'
                : 'hover:bg-gray-200'
            }`}
            title="Save (Ctrl+S)"
          >
            {isSaved ? '保存' : '保存*'}
          </button>
          <button
            onClick={onSaveAs}
            className={`px-2 py-1 rounded text-sm transition-colors ${
              isDarkMode
                ? 'hover:bg-gray-700'
                : 'hover:bg-gray-200'
            }`}
            title="Save As"
          >
            另存为
          </button>
        </div>
        
        <span className={`mx-2 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>|</span>
        
        {/* Export */}
        <div className="flex items-center gap-1">
          <button
            onClick={onExportHtml}
            className={`px-2 py-1 rounded text-sm transition-colors ${
              isDarkMode
                ? 'hover:bg-gray-700'
                : 'hover:bg-gray-200'
            }`}
            title="Export HTML"
          >
            导出HTML
          </button>
          <button
            onClick={onExportPdf}
            className={`px-2 py-1 rounded text-sm transition-colors ${
              isDarkMode
                ? 'hover:bg-gray-700'
                : 'hover:bg-gray-200'
            }`}
            title="Export PDF (Print)"
          >
            导出PDF
          </button>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={onThemeToggle}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            isDarkMode
              ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
              : 'bg-white hover:bg-gray-200 text-gray-700 border border-gray-300'
          }`}
        >
          {isDarkMode ? '☀️ 浅色' : '🌙 深色'}
        </button>
      </div>
    </div>
  )
}

export default Toolbar
