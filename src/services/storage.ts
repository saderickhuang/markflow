/**
 * Storage Service - LocalStorage 自动保存
 */

const STORAGE_KEY = 'markflow_content'
const AUTOSAVE_INTERVAL = 3000 // 3秒自动保存

export interface StorageService {
  save: (content: string) => void
  load: () => string | null
  clear: () => void
}

export const createStorageService = (): StorageService => {
  return {
    save: (content: string) => {
      try {
        localStorage.setItem(STORAGE_KEY, content)
      } catch (error) {
        console.error('Failed to save to localStorage:', error)
      }
    },
    
    load: () => {
      try {
        return localStorage.getItem(STORAGE_KEY)
      } catch (error) {
        console.error('Failed to load from localStorage:', error)
        return null
      }
    },
    
    clear: () => {
      try {
        localStorage.removeItem(STORAGE_KEY)
      } catch (error) {
        console.error('Failed to clear localStorage:', error)
      }
    }
  }
}

// Auto-save hook
export function useAutoSave(content: string, onSave?: () => void) {
  const storage = createStorageService()
  
  // 保存到 localStorage
  if (content) {
    storage.save(content)
    onSave?.()
  }
  
  return {
    storage,
    interval: AUTOSAVE_INTERVAL
  }
}

export { STORAGE_KEY, AUTOSAVE_INTERVAL }
