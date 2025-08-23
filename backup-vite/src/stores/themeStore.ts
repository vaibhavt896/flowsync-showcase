import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ThemeStore {
  theme: 'light' | 'dark' | 'system'
  actualTheme: 'light' | 'dark'
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  initializeTheme: () => void
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: 'system',
      actualTheme: 'light',

      setTheme: (theme) => {
        set({ theme })
        
        // Update actual theme
        let actualTheme: 'light' | 'dark'
        if (theme === 'system') {
          actualTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        } else {
          actualTheme = theme
        }
        set({ actualTheme })
      },

      initializeTheme: () => {
        const { theme } = get()
        
        // Set initial actual theme
        let actualTheme: 'light' | 'dark'
        if (theme === 'system') {
          actualTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        } else {
          actualTheme = theme
        }
        set({ actualTheme })
        
        // Listen for system theme changes
        if (theme === 'system') {
          const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
          mediaQuery.addEventListener('change', () => {
            const newActualTheme = mediaQuery.matches ? 'dark' : 'light'
            set({ actualTheme: newActualTheme })
          })
        }
      },
    }),
    {
      name: 'theme-store',
    }
  )
)