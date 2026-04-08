/**
 * File Service - 文件操作服务
 */

export interface FileService {
  open: () => Promise<{ content: string; filename: string } | null>
  save: (content: string, filename?: string) => Promise<void>
  saveAs: (content: string) => Promise<string | null>
  download: (content: string, filename: string, type: 'html' | 'markdown') => void
  downloadHtml: (renderedHtml: string, filename: string) => void
}

export const createFileService = (): FileService => {
  // 打开文件
  const open = (): Promise<{ content: string; filename: string } | null> => {
    return new Promise((resolve) => {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = '.md,.markdown,.txt'
      
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0]
        if (!file) {
          resolve(null)
          return
        }
        
        const content = await file.text()
        resolve({
          content,
          filename: file.name
        })
      }
      
      input.click()
    })
  }
  
  // 保存文件（需要 File System Access API 支持）
  const save = async (content: string, filename?: string): Promise<void> => {
    // 简单方式：下载文件
    if (filename) {
      download(content, filename, 'markdown')
    }
  }
  
  // 另存为
  const saveAs = async (content: string): Promise<string | null> => {
    // 优先使用 File System Access API
    if ('showSaveFilePicker' in window) {
      try {
        const handle = await (window as any).showSaveFilePicker({
          suggestedName: 'document.md',
          types: [{
            description: 'Markdown Files',
            accept: { 'text/markdown': ['.md'] }
          }]
        })
        const writable = await handle.createWritable()
        await writable.write(content)
        await writable.close()
        return handle.name
      } catch (err: any) {
        // 用户取消了选择
        if (err?.name === 'AbortError') return null
        // 其他错误 fallback 到下载
      }
    }

    // Fallback：提示输入文件名后下载
    const filename = prompt('请输入文件名：', 'document.md')
    if (!filename) return null
    download(content, filename, 'markdown')
    return filename
  }
  
  // 下载 Markdown 文件
  const download = (content: string, filename: string, type: 'html' | 'markdown'): void => {
    let blob: Blob
    
    if (type === 'html') {
      const htmlContent = wrapHtmlContent(content)
      blob = new Blob([htmlContent], { type: 'text/html' })
    } else {
      blob = new Blob([content], { type: 'text/markdown' })
    }
    
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }
  
  // 下载已渲染的 HTML（从 Preview 组件）
  const downloadHtml = (renderedHtml: string, filename: string): void => {
    const htmlContent = wrapRenderedHtml(renderedHtml)
    const blob = new Blob([htmlContent], { type: 'text/html' })
    
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }
  
  return {
    open,
    save,
    saveAs,
    download,
    downloadHtml
  }
}

// 包装 Markdown 为 HTML（不渲染，只作为文本）
function wrapHtmlContent(markdown: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Exported Document</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 20px;
      line-height: 1.6;
    }
    pre { background: #f6f8fa; padding: 16px; border-radius: 6px; overflow-x: auto; }
    code { background: #f6f8fa; padding: 2px 6px; border-radius: 3px; }
    pre code { background: none; padding: 0; }
    blockquote { border-left: 4px solid #ddd; margin: 0; padding-left: 16px; color: #666; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ddd; padding: 8px 12px; text-align: left; }
    th { background: #f6f8fa; }
  </style>
</head>
<body>
${markdown}
</body>
</html>`
}

// 包装已渲染的 HTML
function wrapRenderedHtml(htmlContent: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Exported Document</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 20px;
      line-height: 1.6;
    }
    pre { background: #f6f8fa; padding: 16px; border-radius: 6px; overflow-x: auto; }
    code { background: #f6f8fa; padding: 2px 6px; border-radius: 3px; font-family: 'Consolas', 'Monaco', monospace; }
    pre code { background: none; padding: 0; }
    blockquote { border-left: 4px solid #ddd; margin: 0; padding-left: 16px; color: #666; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ddd; padding: 8px 12px; text-align: left; }
    th { background: #f6f8fa; }
    img { max-width: 100%; }
    a { color: #2196F3; }
  </style>
</head>
<body>
${htmlContent}
</body>
</html>`
}

export const fileService = createFileService()
