interface StatusBarProps {
  wordCount: number
}

function StatusBar({ wordCount }: StatusBarProps) {
  return (
    <div className="flex items-center justify-between px-4 py-1 text-sm bg-gray-100 border-t border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400">
      <span>Ready</span>
      <span>Words: {wordCount}</span>
    </div>
  )
}

export default StatusBar
