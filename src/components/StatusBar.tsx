interface StatusBarProps {
  wordCount: number
  renderDelay?: number
}

function StatusBar({ wordCount, renderDelay = 300 }: StatusBarProps) {
  return (
    <div className="flex items-center justify-between px-4 py-1 text-sm bg-gray-100 border-t border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400">
      <div className="flex items-center gap-4">
        <span>Ready</span>
        <span className="text-gray-500 dark:text-gray-500">|</span>
        <span>Render: {renderDelay}ms</span>
      </div>
      <span>Words: {wordCount}</span>
    </div>
  )
}

export default StatusBar
