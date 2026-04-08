interface ToolbarProps {
  isDarkMode: boolean
  onThemeToggle: () => void
  onNew: () => void
  onOpen: () => void
  onSave: () => void
  onSaveAs: () => void
  onExportHtml: () => void
  onExportPdf: () => void
  onFormat?: (format: string) => void
  isSaved?: boolean
  viewMode?: 'split' | 'single'
  onViewModeToggle?: () => void
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
  onFormat,
  isSaved = true,
  viewMode = 'split',
  onViewModeToggle
}: ToolbarProps) {
  const buttonClass = `px-2 py-1 rounded text-sm transition-colors ${
    isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
  }`
  
  return (
    <div className={`print:hidden flex items-center justify-between px-4 py-2 border-b ${
      isDarkMode 
        ? 'bg-gray-800 border-gray-700 text-gray-200' 
        : 'bg-gray-100 border-gray-300 text-gray-800'
    }`}>
      <div className="flex items-center gap-2">
        <h1 className="text-lg font-semibold mr-4">MarkFlow</h1>
        
        {/* File Operations */}
        <div className="flex items-center gap-1">
          <button onClick={onNew} className={buttonClass} title="新建 (Ctrl+N)">
            新建
          </button>
          <button onClick={onOpen} className={buttonClass} title="打开 (Ctrl+O)">
            打开
          </button>
          <button onClick={onSave} className={buttonClass} title="保存 (Ctrl+S)">
            {isSaved ? '保存' : '保存*'}
          </button>
          <button onClick={onSaveAs} className={buttonClass} title="另存为">
            另存为
          </button>
        </div>
        
        <span className={`mx-2 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>|</span>
        
        {/* Format Buttons */}
        {onFormat && (
          <div className="flex items-center gap-1">
            <button onClick={() => onFormat('h1')} className={buttonClass} title="标题1">
              H1
            </button>
            <button onClick={() => onFormat('h2')} className={buttonClass} title="标题2">
              H2
            </button>
            <button onClick={() => onFormat('h3')} className={buttonClass} title="标题3">
              H3
            </button>
            <button onClick={() => onFormat('h4')} className={buttonClass} title="标题4">
              H4
            </button>
            <button onClick={() => onFormat('h5')} className={buttonClass} title="标题5">
              H5
            </button>
            <button onClick={() => onFormat('h6')} className={buttonClass} title="标题6">
              H6
            </button>
            <span className={`mx-1 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>|</span>
            <button onClick={() => onFormat('bold')} className={buttonClass} title="粗体 (Ctrl+B)">
              B
            </button>
            <button onClick={() => onFormat('italic')} className={buttonClass} title="斜体 (Ctrl+I)">
              I
            </button>
            <button onClick={() => onFormat('strike')} className={buttonClass} title="删除线">
              S
            </button>
            <span className={`mx-1 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>|</span>
            <button onClick={() => onFormat('link')} className={buttonClass} title="链接 (Ctrl+K)">
              🔗
            </button>
            <button onClick={() => onFormat('code')} className={buttonClass} title="代码">
              {'</>'}
            </button>
            <button onClick={() => onFormat('quote')} className={buttonClass} title="引用">
              "
            </button>
            <button onClick={() => onFormat('list')} className={buttonClass} title="无序列表">
              •
            </button>
            <button onClick={() => onFormat('olist')} className={buttonClass} title="有序列表">
              1.
            </button>
            <button onClick={() => onFormat('task')} className={buttonClass} title="任务列表">
              ☐
            </button>
          </div>
        )}
        
        <span className={`mx-2 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>|</span>
        
        {/* Export */}
        <div className="flex items-center gap-1">
          <button onClick={onExportHtml} className={buttonClass} title="导出HTML">
            HTML
          </button>
          <button onClick={onExportPdf} className={buttonClass} title="导出PDF">
            PDF
          </button>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {onViewModeToggle && (
          <button
            onClick={onViewModeToggle}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              isDarkMode
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                : 'bg-white hover:bg-gray-200 text-gray-700 border border-gray-300'
            }`}
            title={viewMode === 'split' ? '切换到单页模式' : '切换到分栏模式'}
          >
            {viewMode === 'split' ? '📄 单页' : '📰 分栏'}
          </button>
        )}
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
