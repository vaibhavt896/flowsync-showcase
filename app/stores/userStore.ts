import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { UserProfile, UserPreferences, ProductivityDNA } from '@/types'
import { generateId } from '@/utils/helpers'

interface UserStore {
  user: UserProfile | null
  isAuthenticated: boolean
  preferences: UserPreferences
  productivityDNA: ProductivityDNA | null
  
  // Actions
  setUser: (user: UserProfile) => void
  logout: () => void
  updatePreferences: (preferences: Partial<UserPreferences>) => void
  updateProductivityDNA: (dna: Partial<ProductivityDNA>) => void
  initializeUser: () => void
}

const DEFAULT_PREFERENCES: UserPreferences = {
  focusDuration: 25 * 60,
  shortBreakDuration: 5 * 60,
  longBreakDuration: 15 * 60,
  longBreakInterval: 4,
  theme: 'system',
  notifications: true,
  soundEnabled: true,
  autoStartBreaks: false,
  autoStartSessions: false,
  blockWebsites: false,
  blockedSites: [
    'facebook.com',
    'twitter.com',
    'instagram.com',
    'youtube.com',
    'reddit.com',
    'tiktok.com',
  ],
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      preferences: DEFAULT_PREFERENCES,
      productivityDNA: null,

      setUser: (user) => {
        set({ 
          user, 
          isAuthenticated: true,
          preferences: { ...DEFAULT_PREFERENCES, ...user.preferences }
        })
      },

      logout: () => {
        set({ 
          user: null, 
          isAuthenticated: false,
          preferences: DEFAULT_PREFERENCES,
          productivityDNA: null 
        })
      },

      updatePreferences: (newPreferences) => {
        const updatedPreferences = { ...get().preferences, ...newPreferences }
        set({ preferences: updatedPreferences })
        
        // Update user object if authenticated
        const { user } = get()
        if (user) {
          set({
            user: {
              ...user,
              preferences: updatedPreferences
            }
          })
        }
      },

      updateProductivityDNA: (newDNA) => {
        const currentDNA = get().productivityDNA
        const updatedDNA = currentDNA ? { ...currentDNA, ...newDNA } : newDNA as ProductivityDNA
        
        set({ productivityDNA: updatedDNA })
        
        // Update user object if authenticated
        const { user } = get()
        if (user) {
          set({
            user: {
              ...user,
              productivityDNA: updatedDNA
            }
          })
        }
      },

      initializeUser: () => {
        // Simple approach: Always reset preferences on initializeUser call
        // This will happen on every page load/refresh, but not on component remounts
        // We control when initializeUser is called from the Timer component
        console.log('🔄 Initializing user - resetting to 25min defaults')
        set({ preferences: DEFAULT_PREFERENCES })
        
        // Create a demo user if not authenticated
        const { isAuthenticated } = get()
        if (!isAuthenticated) {
          const demoUser: UserProfile = {
            id: generateId(),
            email: 'demo@flowsync.app',
            name: 'Demo User',
            preferences: DEFAULT_PREFERENCES,
            productivityDNA: {
              peakHours: Array.from({ length: 24 }, (_, hour) => ({
                hour,
                score: hour >= 9 && hour <= 17 ? 0.8 : 0.3 // Default office hours peak
              })),
              averageFlowDuration: 23 * 60, // 23 minutes
              preferredSessionLength: 25 * 60, // 25 minutes
              energyPatterns: Array.from({ length: 24 }, (_, hour) => ({
                timeOfDay: hour,
                energy: hour >= 8 && hour <= 18 ? 
                  7 + Math.sin((hour - 8) / 10 * Math.PI) * 2 : 4
              })),
              weeklyPatterns: Array.from({ length: 7 }, (_, day) => ({
                dayOfWeek: day,
                productivity: day >= 1 && day <= 5 ? 7.5 : 5 // Weekdays higher
              })),
              contextualPreferences: {
                'deep-work': 35 * 60,
                'meetings': 15 * 60,
                'creative': 30 * 60,
                'admin': 20 * 60,
              }
            },
            createdAt: new Date(),
            lastActive: new Date(),
          }
          
          set({ 
            user: demoUser, 
            isAuthenticated: true,
            preferences: demoUser.preferences,
            productivityDNA: demoUser.productivityDNA 
          })
        }
      },
    }),
    {
      name: 'user-store',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        preferences: state.preferences,
        productivityDNA: state.productivityDNA,
      }),
    }
  )
)