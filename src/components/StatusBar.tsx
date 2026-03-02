interface StatusBarProps {
  wordCount: number
  renderDelay?: number
  filename?: string
  lastSaved?: string
}

function StatusBar({ 
  wordCount, 
  renderDelay = 300,
  filename = '未命名.md',
  lastSaved = ''
}: StatusBarProps) {
  return (
    <div className="flex items-center justify-between px-4 py-1 text-sm bg-gray-100 border-t border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400">
      <div className="flex items-center gap-4">
        <span className="truncate max-w-[200px]" title={filename}>
          {filename}
        </span>
        {lastSaved && (
          <>
            <span className="text-gray-500">|</span>
            <span className="text-green-600 dark:text-green-400">
              已保存 {lastSaved}
            </span>
          </>
        )}
      </div>
      <div className="flex items-center gap-4">
        <span>渲染: {renderDelay}ms</span>
        <span>字数: {wordCount}</span>
      </div>
    </div>
  )
}

export default StatusBar
