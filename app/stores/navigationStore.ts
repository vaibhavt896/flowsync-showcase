import { create } from 'zustand'

export type AppState = 'timer' | 'analytics' | 'insights' | 'settings'

interface NavigationStore {
  currentState: AppState
  previousState: AppState | null
  isTransitioning: boolean
  transitionProgress: number
  
  // Actions
  transitionTo: (state: AppState) => Promise<void>
  setTransitionProgress: (progress: number) => void
  completeTransition: () => void
}

export const useNavigationStore = create<NavigationStore>((set, get) => ({
  currentState: 'timer',
  previousState: null,
  isTransitioning: false,
  transitionProgress: 0,

  transitionTo: async (state: AppState) => {
    const current = get().currentState
    if (current === state || get().isTransitioning) return

    set({ 
      previousState: current,
      isTransitioning: true,
      transitionProgress: 0
    })

    // Simulate transition timing
    return new Promise((resolve) => {
      const duration = 800 // ms
      const startTime = Date.now()
      
      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        
        set({ transitionProgress: progress })
        
        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          set({ 
            currentState: state,
            isTransitioning: false,
            transitionProgress: 1
          })
          resolve()
        }
      }
      
      requestAnimationFrame(animate)
    })
  },

  setTransitionProgress: (progress: number) => {
    set({ transitionProgress: Math.max(0, Math.min(1, progress)) })
  },

  completeTransition: () => {
    set({ 
      isTransitioning: false,
      transitionProgress: 1,
      previousState: null
    })
  }
}))