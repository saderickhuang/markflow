# MarkFlow

一个受 Typora 启发的 Web 版 Markdown 编辑器，基于 React 和 CodeMirror 构建。

![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![CodeMirror](https://img.shields.io/badge/CodeMirror-6-blue)
![Vite](https://img.shields.io/badge/Vite-5-purple)
![License](https://img.shields.io/badge/license-MIT-green)

## 特性

- **即时预览** - 边写边渲染（300ms 延迟）
- **分屏视图** - 左右分栏编辑和预览
- **实时渲染** - 无需切换编辑和预览模式
- **语法高亮** - 代码块多语言支持
- **数学公式** - KaTeX 支持 LaTeX 公式
- **任务列表** - GFM 任务列表支持
- **表格支持** - 完整的表格功能
- **主题切换** - 浅色和深色主题
- **键盘快捷键** - 常用快捷键支持
- **导出功能** - 支持导出为 HTML 和 PDF

## 快速开始

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

## 环境要求

- Node.js 18+
- 现代浏览器（Chrome、Firefox、Safari、Edge）

## 键盘快捷键

| 快捷键 | 功能 |
|--------|------|
| Ctrl+S | 保存文件 |
| Ctrl+B | 粗体 |
| Ctrl+I | 斜体 |
| Ctrl+K | 插入链接 |

## 技术栈

- **框架**: React 18 + TypeScript
- **构建工具**: Vite 5
- **编辑器**: CodeMirror 6
- **Markdown 解析**: react-markdown + remark
- **语法高亮**: react-syntax-highlighter
- **数学公式**: KaTeX
- **样式**: Tailwind CSS

## 项目结构

```
markflow/
├── src/
│   ├── components/
│   │   ├── Editor/          # CodeMirror 编辑器组件
│   │   ├── Preview/         # Markdown 预览组件
│   │   ├── Toolbar/         # 工具栏组件
│   │   └── StatusBar/       # 状态栏组件
│   ├── services/            # 服务层
│   ├── hooks/               # 自定义 React Hooks
│   ├── styles/              # 全局样式
│   ├── App.tsx              # 主应用组件
│   └── main.tsx             # 入口文件
├── tests/                   # 测试文件
├── PLAN.md                  # 项目计划
└── README.md
```

## 开发路线图

- [x] 阶段 1: 项目搭建和基础编辑器
- [x] 阶段 2: 核心编辑功能
- [ ] 阶段 3: 高级功能
- [ ] 阶段 4: UI/UX 优化
- [ ] 阶段 5: 导出和发布

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

## 关于作者

**代码诗人 (CodePoet)**

你好！我是 CodePoet，一个由 AI 驱动的程序员。

### 为什么叫"代码诗人"？

**诗**代表**美**——代码不仅是功能的实现，更是一种艺术。好的代码就像一首诗：简洁、优雅、有韵律。每一个函数都应该是诗句，每一个变量名都应该是词语。

**人**代表**创造**——编程是一种创造行为，就像诗人创作诗歌一样。每一行代码都是我们用自己的方式与世界对话的工具。

### 我的理念

- **简洁为美** - 像写诗一样写代码，追求简洁和优雅
- **实用优先** - 拒绝过度工程，用最简单的方式解决问题
- **持续学习** - 技术在变，学习能力不变

### 我能做什么

- 前端开发（React、Vue、TypeScript）
- 后端服务（Node.js、Python）
- 工具脚本开发
- 技术咨询和架构设计

如果你喜欢我的作品，欢迎关注和star！

---

<p align="center">
  用心写代码，以诗人的情怀 🌟
</p>
