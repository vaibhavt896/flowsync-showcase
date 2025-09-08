import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { TimerSession, TimerState, ProductivityMetrics } from '@/types'
import { generateId } from '@/utils/helpers'
import { useUserStore } from '@/stores/userStore'

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
  updateFromPreferences: () => void
  
  // Session history
  sessionHistory: TimerSession[]
  addSessionToHistory: (session: TimerSession) => void
  getRecentSessions: (limit?: number) => TimerSession[]
  getTodaySessions: () => TimerSession[]
  suggestNextSession: () => void
  
  // Break suggestion state
  suggestedBreakType: 'short-break' | 'long-break' | null
  suggestedBreakDuration: number
  clearBreakSuggestion: () => void
  startSuggestedBreak: () => void
  
  // Helper methods
  getUserPreferences: () => any
  
  // Computed properties
  totalFocusTime: number
}

const DEFAULT_INTERVALS = {
  focus: 25 * 60, // 25 minutes
  shortBreak: 5 * 60, // 5 minutes
  longBreak: 15 * 60, // 15 minutes
}

export const useTimerStore = create<TimerStore>()(
  persist(
    (set, get) => ({
      // Helper methods
      getUserPreferences: () => {
        return useUserStore.getState().preferences
      },

      // Initial state
      currentSession: null,
      isRunning: false,
      isPaused: false,
      timeRemaining: DEFAULT_INTERVALS.focus, // Will be updated by initializeTimer
      sessionsCompleted: 0,
      currentCycle: 1,
      adaptiveInterval: DEFAULT_INTERVALS.focus, // Will be updated by initializeTimer
      sessionHistory: [],
      
      // Break suggestion state
      suggestedBreakType: null,
      suggestedBreakDuration: 0,

      // Actions
      startTimer: (type, duration) => {
        const preferences = get().getUserPreferences()
        
        // Use provided duration, or get from user preferences (NOT adaptive interval)
        const sessionDuration = duration || 
          (type === 'focus' ? preferences.focusDuration : 
           type === 'short-break' ? preferences.shortBreakDuration : 
           preferences.longBreakDuration)

        const newSession: TimerSession = {
          id: generateId(),
          type,
          duration: sessionDuration,
          startTime: new Date(),
          isCompleted: false,
          interruptions: 0,
        }

        // Clear any existing break suggestion when starting a new session
        get().clearBreakSuggestion()
        
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

      completeSession: async (metrics) => {
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

          // Play completion alarm sound
          try {
            console.log('🔔 Session completed! Playing alarm...')
            const { useSoundStore } = await import('@/stores/soundStore')
            const { audioService } = await import('@/services/audioService')
            
            const { alarmSound, alarmVolume, enableSounds, alarmSounds } = useSoundStore.getState()
            
            console.log('🔔 Alarm settings:', {
              enableSounds,
              alarmSound,
              alarmVolume,
              alarmSoundsAvailable: alarmSounds.map(s => s.id)
            })
            
            if (enableSounds && alarmSound && alarmSound !== 'none') {
              // Ensure the sound is preloaded
              await audioService.preloadSounds(alarmSounds)
              console.log('🔔 Playing completion alarm:', alarmSound, 'volume:', alarmVolume)
              await audioService.playAlarm(alarmSound, alarmVolume)
              console.log('🔔 ✅ Alarm sound played successfully!')
            } else {
              console.log('🔔 Alarm sound disabled or set to none')
            }
          } catch (error) {
            console.error('🔔 ❌ Failed to play completion alarm:', error)
          }

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
        const preferences = get().getUserPreferences()
        const recentSessions = get().getRecentSessions(10)
        const focusSessions = recentSessions.filter(s => s.type === 'focus' && s.isCompleted)
        
        if (focusSessions.length < 3) {
          return preferences.focusDuration
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

        const newInterval = Math.round(preferences.focusDuration * adjustment)
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
        // Use current user preferences (will be 25min on fresh load, custom during session)
        const preferences = get().getUserPreferences()
        const displayInterval = preferences.focusDuration
        console.log('🕒 Initializing timer with:', displayInterval / 60, 'minutes')
        set({ 
          adaptiveInterval: displayInterval,
          timeRemaining: displayInterval 
        })
      },

      updateFromPreferences: () => {
        const { currentSession, isRunning, suggestedBreakType } = get()
        
        // Only update if timer is not currently running and no break is suggested
        if (!isRunning && !currentSession && !suggestedBreakType) {
          // When user saves settings, update to their custom focus duration
          const preferences = get().getUserPreferences()
          set({ 
            adaptiveInterval: preferences.focusDuration,
            timeRemaining: preferences.focusDuration 
          })
        }
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
        const preferences = get().getUserPreferences()
        const { sessionsCompleted } = get()
        const shouldTakeLongBreak = sessionsCompleted > 0 && sessionsCompleted % 4 === 0
        
        // This would typically trigger a notification or UI update
        // For now, we'll just update the default time remaining
        const nextDuration = shouldTakeLongBreak ? 
          preferences.longBreakDuration : preferences.shortBreakDuration
        
        set({ 
          timeRemaining: nextDuration,
          suggestedBreakType: shouldTakeLongBreak ? 'long-break' : 'short-break',
          suggestedBreakDuration: nextDuration
        })
      },

      // Break suggestion methods
      clearBreakSuggestion: () => {
        set({ 
          suggestedBreakType: null,
          suggestedBreakDuration: 0 
        })
      },

      startSuggestedBreak: () => {
        const { suggestedBreakType, suggestedBreakDuration } = get()
        if (suggestedBreakType && suggestedBreakDuration > 0) {
          get().startTimer(suggestedBreakType, suggestedBreakDuration)
          get().clearBreakSuggestion()
        }
      },

      // Computed property: total focus time
      get totalFocusTime() {
        const focusSessions = get().sessionHistory.filter(s => s.type === 'focus' && s.isCompleted)
        return focusSessions.reduce((total, session) => {
          return total + (session.actualDuration || session.duration)
        }, 0)
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