/**
 * File Service - 文件操作服务
 */

export interface FileService {
  open: () => Promise<{ content: string; filename: string } | null>
  save: (content: string, filename?: string) => Promise<void>
  saveAs: (content: string) => Promise<string | null>
  download: (content: string, filename: string, type: 'html' | 'markdown') => void
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
  const saveAs = (content: string): Promise<string | null> => {
    return new Promise((resolve) => {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = '.md'
      
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0]
        if (!file) {
          resolve(null)
          return
        }
        
        // 写入文件（如果浏览器支持）
        try {
          const writable = await (file as any).createWritable()
          await writable.write(content)
          await writable.close()
          resolve(file.name)
        } catch {
          // 不支持则下载
          download(content, file.name, 'markdown')
          resolve(file.name)
        }
      }
      
      input.click()
    })
  }
  
  // 下载文件
  const download = (content: string, filename: string, type: 'html' | 'markdown'): void => {
    let blob: Blob
    let mimeType: string
    
    if (type === 'html') {
      const htmlContent = wrapHtmlContent(content)
      blob = new Blob([htmlContent], { type: 'text/html' })
      mimeType = 'text/html'
    } else {
      blob = new Blob([content], { type: 'text/markdown' })
      mimeType = 'text/markdown'
    }
    
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
    download
  }
}

// 包装 HTML 内容
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

export const fileService = createFileService()
