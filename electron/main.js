const { app, BrowserWindow, Menu, shell } = require('electron')
const path = require('path')

// Environment
const isDev = process.env.NODE_ENV === 'development'

let mainWindow = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    title: 'MarkFlow',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // Load the app
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000')
    mainWindow.webContents.openDevTools()
  } else {
    // In production, use __dirname to find the dist folder
    // In packaged app, __dirname will be app.asar/electron
    // We need to go up to find dist
    const distPath = path.join(__dirname, '..', 'dist', 'index.html')
    console.log('Loading from:', distPath)
    mainWindow.loadFile(distPath)
  }

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

// Create application menu
function createMenu() {
  const template = [
    {
      label: '文件',
      submenu: [
        {
          label: '新建',
          accelerator: 'CmdOrCtrl+N',
          click: () => mainWindow?.webContents.send('menu-new')
        },
        {
          label: '打开',
          accelerator: 'CmdOrCtrl+O',
          click: () => mainWindow?.webContents.send('menu-open')
        },
        {
          label: '保存',
          accelerator: 'CmdOrCtrl+S',
          click: () => mainWindow?.webContents.send('menu-save')
        },
        { type: 'separator' },
        {
          label: '导出HTML',
          click: () => mainWindow?.webContents.send('menu-export-html')
        },
        {
          label: '导出PDF',
          click: () => mainWindow?.webContents.send('menu-export-pdf')
        },
        { type: 'separator' },
        { role: 'quit' }
      ]
    },
    {
      label: '编辑',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' }
      ]
    },
    {
      label: '格式',
      submenu: [
        {
          label: '标题1',
          accelerator: 'CmdOrCtrl+1',
          click: () => mainWindow?.webContents.send('menu-format', 'h1')
        },
        {
          label: '标题2',
          accelerator: 'CmdOrCtrl+2',
          click: () => mainWindow?.webContents.send('menu-format', 'h2')
        },
        {
          label: '标题3',
          accelerator: 'CmdOrCtrl+3',
          click: () => mainWindow?.webContents.send('menu-format', 'h3')
        },
        {
          label: '标题4',
          accelerator: 'CmdOrCtrl+4',
          click: () => mainWindow?.webContents.send('menu-format', 'h4')
        },
        {
          label: '标题5',
          accelerator: 'CmdOrCtrl+5',
          click: () => mainWindow?.webContents.send('menu-format', 'h5')
        },
        {
          label: '标题6',
          accelerator: 'CmdOrCtrl+6',
          click: () => mainWindow?.webContents.send('menu-format', 'h6')
        },
        { type: 'separator' },
        {
          label: '粗体',
          accelerator: 'CmdOrCtrl+B',
          click: () => mainWindow?.webContents.send('menu-format', 'bold')
        },
        {
          label: '斜体',
          accelerator: 'CmdOrCtrl+I',
          click: () => mainWindow?.webContents.send('menu-format', 'italic')
        },
        {
          label: '删除线',
          click: () => mainWindow?.webContents.send('menu-format', 'strike')
        },
        { type: 'separator' },
        {
          label: '链接',
          accelerator: 'CmdOrCtrl+K',
          click: () => mainWindow?.webContents.send('menu-format', 'link')
        },
        {
          label: '代码',
          click: () => mainWindow?.webContents.send('menu-format', 'code')
        },
        {
          label: '引用',
          click: () => mainWindow?.webContents.send('menu-format', 'quote')
        },
        { type: 'separator' },
        {
          label: '无序列表',
          click: () => mainWindow?.webContents.send('menu-format', 'list')
        },
        {
          label: '有序列表',
          click: () => mainWindow?.webContents.send('menu-format', 'olist')
        },
        {
          label: '任务列表',
          click: () => mainWindow?.webContents.send('menu-format', 'task')
        }
      ]
    },
    {
      label: '视图',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: '窗口',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        { role: 'close' }
      ]
    },
    {
      label: '帮助',
      submenu: [
        {
          label: '关于 MarkFlow',
          click: () => {
            const { dialog } = require('electron')
            dialog.showMessageBox({
              type: 'info',
              title: '关于 MarkFlow',
              message: 'MarkFlow v1.0.0',
              detail: '一个受 Typora 启发的 Web 版 Markdown 编辑器\n\n由 CodePoet (代码诗人) 开发'
            })
          }
        }
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

app.whenReady().then(() => {
  createWindow()
  createMenu()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
