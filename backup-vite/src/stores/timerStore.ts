import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { TimerSession, TimerState, ProductivityMetrics } from '@/types'
import { generateId } from '@/utils/helpers'

interface TimerStore extends TimerState {
  // Actions
  startTimer: (type: 'focus' | 'short-break' | 'long-break', duration?: number) => void
  pauseTimer: () => void
  resumeTimer: () => void
  stopTimer: () => void
  completeSession: (metrics?: ProductivityMetrics) => void
  updateTimeRemaining: (time: number) => void
  getAdaptiveInterval: () => number
  setAdaptiveInterval: (interval: number) => void
  resetTimer: () => void
  initializeTimer: () => void
  
  // Session history
  sessionHistory: TimerSession[]
  addSessionToHistory: (session: TimerSession) => void
  getRecentSessions: (limit?: number) => TimerSession[]
  getTodaySessions: () => TimerSession[]
}

const DEFAULT_INTERVALS = {
  focus: 25 * 60, // 25 minutes
  shortBreak: 5 * 60, // 5 minutes
  longBreak: 15 * 60, // 15 minutes
}

export const useTimerStore = create<TimerStore>()(
  persist(
    (set, get) => ({
      // Initial state
      currentSession: null,
      isRunning: false,
      isPaused: false,
      timeRemaining: DEFAULT_INTERVALS.focus,
      sessionsCompleted: 0,
      currentCycle: 1,
      adaptiveInterval: DEFAULT_INTERVALS.focus,
      sessionHistory: [],

      // Actions
      startTimer: (type, duration) => {
        const adaptiveInterval = get().getAdaptiveInterval()
        const sessionDuration = duration || 
          (type === 'focus' ? adaptiveInterval : 
           type === 'short-break' ? DEFAULT_INTERVALS.shortBreak : 
           DEFAULT_INTERVALS.longBreak)

        const newSession: TimerSession = {
          id: generateId(),
          type,
          duration: sessionDuration,
          startTime: new Date(),
          isCompleted: false,
          interruptions: 0,
        }

        set({
          currentSession: newSession,
          isRunning: true,
          isPaused: false,
          timeRemaining: sessionDuration,
        })
      },

      pauseTimer: () => {
        set({ isRunning: false, isPaused: true })
      },

      resumeTimer: () => {
        set({ isRunning: true, isPaused: false })
      },

      stopTimer: () => {
        const { currentSession } = get()
        if (currentSession) {
          const completedSession: TimerSession = {
            ...currentSession,
            endTime: new Date(),
            isCompleted: false,
            actualDuration: currentSession.duration - get().timeRemaining,
          }
          get().addSessionToHistory(completedSession)
        }

        set({
          currentSession: null,
          isRunning: false,
          isPaused: false,
          timeRemaining: get().adaptiveInterval,
        })
      },

      completeSession: (metrics) => {
        const { currentSession, sessionsCompleted } = get()
        if (currentSession) {
          const completedSession: TimerSession = {
            ...currentSession,
            endTime: new Date(),
            isCompleted: true,
            actualDuration: currentSession.duration,
            productivity: metrics,
          }

          get().addSessionToHistory(completedSession)

          // Update sessions completed and cycle
          const newSessionsCompleted = sessionsCompleted + 1
          const newCycle = currentSession.type === 'focus' ? 
            Math.floor(newSessionsCompleted / 4) + 1 : get().currentCycle

          set({
            currentSession: null,
            isRunning: false,
            isPaused: false,
            timeRemaining: 0,
            sessionsCompleted: newSessionsCompleted,
            currentCycle: newCycle,
          })

          // Auto-suggest next session
          get().suggestNextSession()
        }
      },

      updateTimeRemaining: (time) => {
        set({ timeRemaining: Math.max(0, time) })
        
        // Auto-complete when time reaches 0
        if (time <= 0) {
          get().completeSession()
        }
      },

      getAdaptiveInterval: () => {
        const recentSessions = get().getRecentSessions(10)
        const focusSessions = recentSessions.filter(s => s.type === 'focus' && s.isCompleted)
        
        if (focusSessions.length < 3) {
          return DEFAULT_INTERVALS.focus
        }

        // Calculate average completion rate and adjust accordingly
        const avgCompletionRate = focusSessions.reduce((sum, session) => {
          const rate = (session.actualDuration || session.duration) / session.duration
          return sum + rate
        }, 0) / focusSessions.length

        // Adjust interval based on completion rate
        let adjustment = 1
        if (avgCompletionRate > 0.95) {
          adjustment = 1.1 // Increase by 10% if consistently completing
        } else if (avgCompletionRate < 0.7) {
          adjustment = 0.9 // Decrease by 10% if frequently interrupted
        }

        const newInterval = Math.round(DEFAULT_INTERVALS.focus * adjustment)
        return Math.max(15 * 60, Math.min(45 * 60, newInterval)) // Clamp between 15-45 minutes
      },

      setAdaptiveInterval: (interval) => {
        set({ adaptiveInterval: interval })
      },

      resetTimer: () => {
        set({
          currentSession: null,
          isRunning: false,
          isPaused: false,
          timeRemaining: get().adaptiveInterval,
        })
      },

      initializeTimer: () => {
        const adaptiveInterval = get().getAdaptiveInterval()
        set({ 
          adaptiveInterval,
          timeRemaining: adaptiveInterval 
        })
      },

      // Session history methods
      addSessionToHistory: (session) => {
        set(state => ({
          sessionHistory: [session, ...state.sessionHistory].slice(0, 1000) // Keep last 1000 sessions
        }))
      },

      getRecentSessions: (limit = 10) => {
        return get().sessionHistory.slice(0, limit)
      },

      getTodaySessions: () => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        
        return get().sessionHistory.filter(session => {
          const sessionDate = new Date(session.startTime)
          return sessionDate >= today
        })
      },

      // Helper method to suggest next session
      suggestNextSession: () => {
        const { sessionsCompleted } = get()
        const shouldTakeLongBreak = sessionsCompleted > 0 && sessionsCompleted % 4 === 0
        
        // This would typically trigger a notification or UI update
        // For now, we'll just update the default time remaining
        const nextType = shouldTakeLongBreak ? 'long-break' : 'short-break'
        const nextDuration = shouldTakeLongBreak ? 
          DEFAULT_INTERVALS.longBreak : DEFAULT_INTERVALS.shortBreak
        
        set({ timeRemaining: nextDuration })
      },
    }),
    {
      name: 'timer-store',
      partialize: (state) => ({
        sessionsCompleted: state.sessionsCompleted,
        currentCycle: state.currentCycle,
        adaptiveInterval: state.adaptiveInterval,
        sessionHistory: state.sessionHistory,
      }),
    }
  )
)