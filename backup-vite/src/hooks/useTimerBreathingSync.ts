import { useEffect } from 'react'
import { useBreathing } from '../contexts/BreathingContext'
import { useTimer } from './useTimer'

export function useTimerBreathingSync() {
  const { 
    setSessionActive, 
    setSessionTimeRemaining, 
    setBreathingState 
  } = useBreathing()
  
  const { 
    isRunning, 
    timeRemaining, 
    currentSession 
  } = useTimer()

  // Sync timer state with breathing context
  useEffect(() => {
    setSessionActive(isRunning)
    setSessionTimeRemaining(timeRemaining)
    
    // Determine breathing state based on session type
    if (isRunning && currentSession) {
      switch (currentSession.type) {
        case 'focus':
          setBreathingState('focus')
          break
        case 'short-break':
        case 'long-break':
          setBreathingState('break')
          break
        default:
          setBreathingState('focus')
      }
    } else {
      setBreathingState('idle')
    }
  }, [isRunning, timeRemaining, currentSession, setSessionActive, setSessionTimeRemaining, setBreathingState])
}

export default useTimerBreathingSync