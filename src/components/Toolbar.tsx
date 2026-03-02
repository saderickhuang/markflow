interface ToolbarProps {
  isDarkMode: boolean
  onThemeToggle: () => void
}

function Toolbar({ isDarkMode, onThemeToggle }: ToolbarProps) {
  return (
    <div className={`flex items-center justify-between px-4 py-2 border-b ${
      isDarkMode 
        ? 'bg-gray-800 border-gray-700 text-gray-200' 
        : 'bg-gray-100 border-gray-300 text-gray-800'
    }`}>
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold">MarkFlow</h1>
        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Web Markdown Editor
        </span>
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
          {isDarkMode ? '☀️ Light' : '🌙 Dark'}
        </button>
      </div>
    </div>
  )
}

export default Toolbar
