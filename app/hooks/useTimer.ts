import { useEffect, useRef, useCallback } from 'react'
import { useTimerStore } from '@/stores/timerStore'
import { useFlowStore } from '@/stores/flowStore'
import { useUserStore } from '@/stores/userStore'

export function useTimer() {
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const {
    currentSession,
    isRunning,
    isPaused,
    timeRemaining,
    sessionsCompleted,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    updateTimeRemaining,
    completeSession,
    getAdaptiveInterval,
    resetTimer,
  } = useTimerStore()

  const { isCurrentlyInFlow } = useFlowStore()
  const { preferences } = useUserStore()

  // Timer tick function
  const tick = useCallback(() => {
    if (timeRemaining > 0) {
      updateTimeRemaining(timeRemaining - 1)
    } else {
      // Session completed
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
      
      // Collect final metrics if needed
      completeSession()
      
      // Notify completion
      if (preferences.notifications) {
        showNotification()
      }
      
      if (preferences.soundEnabled) {
        playCompletionSound()
      }
    }
  }, [timeRemaining, updateTimeRemaining, completeSession, preferences])

  // Start/stop timer based on running state
  useEffect(() => {
    if (isRunning && !isPaused) {
      timerRef.current = setInterval(tick, 1000)
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isRunning, isPaused, tick])

  // Auto-start next session if enabled
  useEffect(() => {
    if (!currentSession && sessionsCompleted > 0) {
      const shouldStartBreak = preferences.autoStartBreaks
      const shouldStartSession = preferences.autoStartSessions
      
      if (shouldStartBreak || shouldStartSession) {
        setTimeout(() => {
          const isBreakTime = sessionsCompleted % 4 === 0
          if (isBreakTime && shouldStartBreak) {
            startTimer('long-break')
          } else if (!isBreakTime && shouldStartBreak) {
            startTimer('short-break')
          } else if (shouldStartSession) {
            startTimer('focus', getAdaptiveInterval())
          }
        }, 5000) // 5 second delay
      }
    }
  }, [currentSession, sessionsCompleted, preferences, startTimer, getAdaptiveInterval])

  const showNotification = () => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const sessionType = currentSession?.type || 'session'
      const title = sessionType === 'focus' ? 'Focus Session Complete!' : 'Break Time Over!'
      const body = sessionType === 'focus' 
        ? 'Great work! Time for a well-deserved break.'
        : 'Break time is over. Ready to focus again?'
      
      new Notification(title, {
        body,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'flowsync-timer',
        requireInteraction: true,
      })
    }
  }

  const playCompletionSound = () => {
    // Simple beep sound - in a real app you'd have audio files
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gain = audioContext.createGain()
    
    oscillator.connect(gain)
    gain.connect(audioContext.destination)
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1)
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2)
    
    gain.gain.setValueAtTime(0.3, audioContext.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
    
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.3)
  }

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      return permission === 'granted'
    }
    return false
  }

  // Helper functions
  const startFocusSession = useCallback((duration?: number) => {
    const adaptiveInterval = duration || getAdaptiveInterval()
    startTimer('focus', adaptiveInterval)
  }, [startTimer, getAdaptiveInterval])

  const startBreak = useCallback((isLong = false) => {
    const breakType = isLong ? 'long-break' : 'short-break'
    startTimer(breakType)
  }, [startTimer])

  const toggleTimer = useCallback(() => {
    if (isRunning) {
      pauseTimer()
    } else if (isPaused) {
      resumeTimer()
    } else {
      startFocusSession()
    }
  }, [isRunning, isPaused, pauseTimer, resumeTimer, startFocusSession])

  const skipSession = useCallback(() => {
    stopTimer()
    resetTimer()
  }, [stopTimer, resetTimer])

  // Flow-aware pause protection
  const pauseWithFlowCheck = useCallback(() => {
    const inFlow = isCurrentlyInFlow()
    
    if (inFlow && currentSession?.type === 'focus') {
      // Show warning before pausing during flow
      const confirmPause = window.confirm(
        'You appear to be in a flow state. Are you sure you want to pause?'
      )
      if (confirmPause) {
        pauseTimer()
      }
    } else {
      pauseTimer()
    }
  }, [isCurrentlyInFlow, currentSession, pauseTimer])

  return {
    // State
    currentSession,
    isRunning,
    isPaused,
    timeRemaining,
    sessionsCompleted,
    totalTime: currentSession?.duration || getAdaptiveInterval(),
    
    // Actions
    startFocusSession,
    startBreak,
    toggleTimer,
    pause: pauseWithFlowCheck,
    resume: resumeTimer,
    stop: stopTimer,
    stopTimer,
    skip: skipSession,
    reset: resetTimer,
    startTimer,
    pauseTimer,
    
    // Utilities
    requestNotificationPermission,
    getAdaptiveInterval,
  }
}