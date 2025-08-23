import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

export type BreathingState = 'focus' | 'transition' | 'break' | 'idle'

interface BreathingContextType {
  breathingState: BreathingState
  breathingRate: number // Hz (breaths per second)
  isSessionActive: boolean
  sessionTimeRemaining: number // seconds
  transitionIntensity: number // 0-1, how close to break
  setBreathingState: (state: BreathingState) => void
  setSessionActive: (active: boolean) => void
  setSessionTimeRemaining: (time: number) => void
}

const BreathingContext = createContext<BreathingContextType | undefined>(undefined)

export function useBreathing() {
  const context = useContext(BreathingContext)
  if (!context) {
    throw new Error('useBreathing must be used within a BreathingProvider')
  }
  return context
}

interface BreathingProviderProps {
  children: ReactNode
}

export function BreathingProvider({ children }: BreathingProviderProps) {
  const [breathingState, setBreathingState] = useState<BreathingState>('idle')
  const [isSessionActive, setSessionActive] = useState(false)
  const [sessionTimeRemaining, setSessionTimeRemaining] = useState(0)
  const [transitionIntensity, setTransitionIntensity] = useState(0)

  // Calculate breathing rate based on state and transition intensity
  const calculateBreathingRate = (state: BreathingState, intensity: number): number => {
    switch (state) {
      case 'focus':
        // Base rate: 0.1Hz (6 breaths/minute)
        // Gradually increase as approaching break
        return 0.1 + (intensity * 0.05) // 0.1Hz to 0.15Hz
      case 'transition':
        return 0.15 // 9 breaths/minute - preparing for break
      case 'break':
        return 0.08 // Slower, more relaxed
      case 'idle':
      default:
        return 0.12 // Neutral breathing rate
    }
  }

  const breathingRate = calculateBreathingRate(breathingState, transitionIntensity)

  // Update transition intensity based on session progress
  useEffect(() => {
    if (isSessionActive && breathingState === 'focus') {
      // Assume 25-minute sessions, start transition in last 5 minutes
      const sessionDuration = 25 * 60 // 25 minutes in seconds
      const timeElapsed = sessionDuration - sessionTimeRemaining
      const transitionStartTime = sessionDuration - (5 * 60) // Last 5 minutes
      
      if (timeElapsed >= transitionStartTime) {
        const transitionProgress = (timeElapsed - transitionStartTime) / (5 * 60)
        setTransitionIntensity(Math.min(1, Math.max(0, transitionProgress)))
      } else {
        setTransitionIntensity(0)
      }
    } else {
      setTransitionIntensity(0)
    }
  }, [sessionTimeRemaining, isSessionActive, breathingState])

  // Auto-transition states based on session status
  useEffect(() => {
    if (isSessionActive) {
      if (sessionTimeRemaining <= 0) {
        setBreathingState('break')
      } else if (transitionIntensity > 0.5) {
        setBreathingState('transition')
      } else {
        setBreathingState('focus')
      }
    } else {
      setBreathingState('idle')
    }
  }, [isSessionActive, sessionTimeRemaining, transitionIntensity])

  const value: BreathingContextType = {
    breathingState,
    breathingRate,
    isSessionActive,
    sessionTimeRemaining,
    transitionIntensity,
    setBreathingState,
    setSessionActive,
    setSessionTimeRemaining
  }

  return (
    <BreathingContext.Provider value={value}>
      {children}
    </BreathingContext.Provider>
  )
}

export default BreathingContext