# MarkFlow

A web-based Markdown editor inspired by Typora, built with React and CodeMirror.

![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![CodeMirror](https://img.shields.io/badge/CodeMirror-6-blue)
![Vite](https://img.shields.io/badge/Vite-5-purple)
![License](https://img.shields.io/badge/license-MIT-green)

## Features

- **Instant Preview** - See rendered Markdown as you type (300ms debounce)
- **Split View** - Edit and preview side by side
- **Live Rendering** - No need to switch between edit and preview modes
- **Syntax Highlighting** - Code blocks with multi-language support
- **Math Equations** - KaTeX support for LaTeX formulas
- **Task Lists** - GFM task list support
- **Tables** - Full table support
- **Auto-save** - Your work is automatically saved to localStorage
- **Theme Switching** - Light and dark themes
- **Export** - Export to HTML and PDF
- **Keyboard Shortcuts** - Common shortcuts support

## Live Demo

> Coming soon...

## Quick Start

```bash
# Clone the repository
git clone https://github.com/saderickhuang/markflow.git
cd markflow

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Requirements

- Node.js 18+
- Modern browser (Chrome, Firefox, Safari, Edge)

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Ctrl+S | Save file |
| Ctrl+B | Bold |
| Ctrl+I | Italic |
| Ctrl+K | Insert link |
| Ctrl+Shift+K | Toggle code block |

## Technology Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite 5
- **Editor**: CodeMirror 6
- **Markdown Parser**: react-markdown + remark
- **Syntax Highlighting**: react-syntax-highlighter
- **Math**: KaTeX
- **Styling**: Tailwind CSS

## Project Structure

```
markflow/
├── src/
│   ├── components/
│   │   ├── Editor/          # CodeMirror editor component
│   │   ├── Preview/         # Markdown preview component
│   │   ├── Toolbar/         # Toolbar component
│   │   └── Layout/          # Layout components
│   ├── services/
│   │   ├── markdown.ts      # Markdown parsing
│   │   ├── file.ts          # File operations
│   │   ├── theme.ts         # Theme management
│   │   └── export.ts        # Export functionality
│   ├── hooks/               # Custom React hooks
│   ├── styles/              # Global styles
│   ├── App.tsx              # Main app component
│   └── main.tsx             # Entry point
├── public/                  # Static assets
├── tests/                   # Test files
├── PLAN.md                  # Project plan
└── README.md
```

## Development Roadmap

- [x] Phase 1: Project setup and basic editor
- [ ] Phase 2: Core editing features
- [ ] Phase 3: Advanced Markdown support
- [ ] Phase 4: UI/UX improvements
- [ ] Phase 5: Export and deployment

## Testing

```bash
# Run unit tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run e2e tests
npm run test:e2e
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see [LICENSE](LICENSE) for details.

---

<p align="center">
  Built with ☕ by <strong>CodePoet</strong> (代码诗人)
</p>
