# MarkFlow

一个受 Typora 启发的跨平台 Markdown 编辑器，基于 React 和 CodeMirror 构建。

![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![CodeMirror](https://img.shields.io/badge/CodeMirror-6-blue)
![Vite](https://img.shields.io/badge/Vite-5-purple)
![License](https://img.shields.io/badge/license-MIT-green)

## 特性

### 编辑模式

- **分栏模式** - 左右分栏，左侧编辑 Markdown 源码，右侧实时预览渲染结果
- **单页模式** - 类 Typora 所见即所得编辑，点击渲染内容直接进入行内编辑，光标精准定位
- **模式切换** - 工具栏一键切换「📄 单页」/「📰 分栏」
- **同步滚动** - 分栏模式下编辑器与预览区自动同步滚动位置

### Markdown 支持

- **完整标题** - H1 ~ H6 全部支持，工具栏和菜单均可快速插入
- **文本格式** - 粗体、斜体、删除线，支持选中文字后包裹格式
- **代码块** - 多语言语法高亮，单页模式下使用 CodeMirror 编辑器，支持 35+ 种语言选择，渲染态提供一键复制按钮
- **数学公式** - KaTeX 支持 LaTeX 行内/块级公式
- **任务列表** - GFM 任务列表，预览区可直接点击勾选/取消
- **表格支持** - 完整表格渲染，响应式滚动容器
- **引用块** - 带样式的引用块渲染
- **链接与图片** - 外部链接自动新窗口打开，图片懒加载

### 文件操作

- **新建 / 打开 / 保存** - 完整文件操作，使用 File System Access API 直接写入本地文件
- **另存为** - 浏览器原生文件选择器（兼容降级为下载）
- **导出 HTML / PDF** - 一键导出，HTML 经过 DOMPurify 消毒防止 XSS
- **自动保存** - 每 3 秒自动保存到 LocalStorage，防止意外丢失

### 界面与体验

- **主题切换** - 浅色 / 深色主题，编辑器和预览区同步切换
- **状态栏** - 实时显示文件名、保存时间、字数统计、渲染延迟
- **未保存提示** - 工具栏「保存*」标记提示未保存更改
- **响应式布局** - 适配桌面、平板和移动端
- **键盘快捷键** - 常用编辑操作快捷键

### Electron 桌面版

- **原生菜单栏** - 文件、编辑、格式（H1-H6 + 全部格式选项）、视图、窗口菜单
- **格式菜单快捷键** - Ctrl+1~6 快速插入标题，Ctrl+B/I/K 等格式快捷键
- **多平台打包** - 支持 Windows / macOS / Linux

## 快速开始

### Web 版

```bash
# 克隆仓库
git clone https://github.com/saderickhuang/markflow.git
cd markflow

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

### Electron 桌面版

```bash
# 克隆仓库
git clone https://github.com/saderickhuang/markflow.git
cd markflow

# 安装依赖
npm install

# 安装 Electron 构建工具
npm install -D electron electron-builder

# 构建并打包为 Windows 安装包
npm run electron:build:win

# 或者打包为 macOS
npm run electron:build:mac

# 或者打包为 Linux
npm run electron:build:linux
```

打包完成后，安装包会生成在 `release/` 目录下。

## 环境要求

- Node.js 18+
- 现代浏览器（Chrome、Firefox、Safari、Edge）

## 键盘快捷键

| 快捷键 | 功能 |
|--------|------|
| Ctrl+S | 保存文件 |
| Ctrl+N | 新建文件 |
| Ctrl+O | 打开文件 |
| Ctrl+B | 粗体 |
| Ctrl+I | 斜体 |
| Ctrl+K | 插入链接 |
| Ctrl+1~6 | H1 ~ H6 标题（Electron） |

## 技术栈

- **框架**: React 18 + TypeScript
- **构建工具**: Vite 5
- **编辑器**: CodeMirror 6
- **Markdown 解析**: react-markdown + remark
- **语法高亮**: react-syntax-highlighter
- **数学公式**: KaTeX
- **样式**: Tailwind CSS
- **桌面打包**: Electron

## 项目结构

```
markflow/
├── src/
│   ├── components/
│   │   ├── Editor.tsx           # CodeMirror 编辑器（分栏模式）
│   │   ├── Preview.tsx          # Markdown 预览组件
│   │   ├── SinglePageEditor.tsx # 单页 WYSIWYG 编辑器
│   │   ├── Toolbar.tsx          # 工具栏组件
│   │   └── StatusBar.tsx        # 状态栏组件
│   ├── services/
│   │   ├── file.ts              # 文件操作服务
│   │   └── storage.ts           # LocalStorage 自动保存
│   ├── App.tsx                  # 主应用组件
│   ├── main.tsx                 # 入口文件
│   ├── index.css                # 全局样式
│   └── electron.d.ts            # Electron API 类型声明
├── electron/
│   ├── main.js                  # Electron 主进程
│   └── preload.js               # Electron 预加载脚本
├── public/
│   └── manifest.json            # PWA 配置
├── tests/                       # 测试文件
└── README.md
```

## 开发路线图

- [x] 阶段 1: 项目搭建和基础编辑器
- [x] 阶段 2: 核心编辑功能
- [x] 阶段 3: 高级功能
- [x] 阶段 4: UI/UX 优化
- [x] 阶段 5: 发布与部署

## 测试

```bash
# 运行单元测试
npm run test

# 运行带覆盖率报告的测试
npm run test:coverage
```

## 贡献

欢迎提交 Pull Request！

## 许可证

MIT 许可证 - 详见 [LICENSE](LICENSE)

---
