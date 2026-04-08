export interface ElectronAPI {
  onMenuNew: (callback: () => void) => void
  onMenuOpen: (callback: () => void) => void
  onMenuSave: (callback: () => void) => void
  onMenuExportHtml: (callback: () => void) => void
  onMenuExportPdf: (callback: () => void) => void
  platform: string
  removeAllListeners: (channel: string) => void
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI
  }
}
