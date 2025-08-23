import { useEffect, useState, ReactNode } from 'react'
import { cn } from '@/utils/helpers'

type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night'

interface TimeAwareGlassProps {
  children: ReactNode
  className?: string
  updateInterval?: number // in minutes
  autoUpdate?: boolean
}

export function TimeAwareGlass({
  children,
  className = '',
  updateInterval = 30,
  autoUpdate = true
}: TimeAwareGlassProps) {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('afternoon')

  const determineTimeOfDay = (): TimeOfDay => {
    const hour = new Date().getHours()
    
    if (hour >= 5 && hour < 12) return 'morning'
    if (hour >= 12 && hour < 17) return 'afternoon'
    if (hour >= 17 && hour < 21) return 'evening'
    return 'night'
  }

  const updateTimeOfDay = () => {
    const currentTime = determineTimeOfDay()
    setTimeOfDay(currentTime)
    
    // Update global CSS custom properties based on time
    const root = document.documentElement
    
    switch (currentTime) {
      case 'morning':
        root.style.setProperty('--ambient-hue', '40') // Golden morning light
        root.style.setProperty('--ambient-saturation', '60%')
        root.style.setProperty('--ambient-lightness', '75%')
        root.style.setProperty('--glass-temperature', 'warm')
        break
      case 'afternoon':
        root.style.setProperty('--ambient-hue', '200') // Cool blue daylight
        root.style.setProperty('--ambient-saturation', '40%')
        root.style.setProperty('--ambient-lightness', '70%')
        root.style.setProperty('--glass-temperature', 'cool')
        break
      case 'evening':
        root.style.setProperty('--ambient-hue', '320') // Warm pink/purple sunset
        root.style.setProperty('--ambient-saturation', '50%')
        root.style.setProperty('--ambient-lightness', '65%')
        root.style.setProperty('--glass-temperature', 'warm')
        break
      case 'night':
        root.style.setProperty('--ambient-hue', '240') // Deep blue night
        root.style.setProperty('--ambient-saturation', '30%')
        root.style.setProperty('--ambient-lightness', '20%')
        root.style.setProperty('--glass-temperature', 'cool')
        break
    }
  }

  useEffect(() => {
    updateTimeOfDay()
    
    if (autoUpdate) {
      const interval = setInterval(updateTimeOfDay, updateInterval * 60 * 1000)
      return () => clearInterval(interval)
    }
  }, [updateInterval, autoUpdate])

  // Update on window focus to catch time changes while away
  useEffect(() => {
    if (autoUpdate) {
      const handleFocus = () => updateTimeOfDay()
      window.addEventListener('focus', handleFocus)
      return () => window.removeEventListener('focus', handleFocus)
    }
  }, [autoUpdate])

  return (
    <div 
      className={cn('glass-time-aware', className)}
      data-time={timeOfDay}
    >
      {children}
    </div>
  )
}

// Hook to get current time of day
export function useTimeOfDay() {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('afternoon')

  useEffect(() => {
    const updateTime = () => {
      const hour = new Date().getHours()
      if (hour >= 5 && hour < 12) setTimeOfDay('morning')
      else if (hour >= 12 && hour < 17) setTimeOfDay('afternoon')
      else if (hour >= 17 && hour < 21) setTimeOfDay('evening')
      else setTimeOfDay('night')
    }

    updateTime()
    const interval = setInterval(updateTime, 30 * 60 * 1000) // Update every 30 minutes
    
    const handleFocus = () => updateTime()
    window.addEventListener('focus', handleFocus)

    return () => {
      clearInterval(interval)
      window.removeEventListener('focus', handleFocus)
    }
  }, [])

  return timeOfDay
}

// Component for time-based ambient lighting
export function TimeBasedAmbientLighting() {
  const timeOfDay = useTimeOfDay()

  const getTimeBasedColors = () => {
    switch (timeOfDay) {
      case 'morning':
        return {
          primary: 'rgba(255, 215, 160, 0.15)',
          secondary: 'rgba(255, 195, 120, 0.1)',
          accent: 'rgba(255, 235, 180, 0.08)'
        }
      case 'afternoon':
        return {
          primary: 'rgba(200, 220, 255, 0.12)',
          secondary: 'rgba(220, 235, 255, 0.08)',
          accent: 'rgba(240, 248, 255, 0.06)'
        }
      case 'evening':
        return {
          primary: 'rgba(255, 160, 215, 0.18)',
          secondary: 'rgba(255, 180, 225, 0.12)',
          accent: 'rgba(255, 200, 235, 0.08)'
        }
      case 'night':
        return {
          primary: 'rgba(160, 160, 255, 0.1)',
          secondary: 'rgba(180, 180, 255, 0.06)',
          accent: 'rgba(200, 200, 255, 0.04)'
        }
    }
  }

  const colors = getTimeBasedColors()

  return (
    <div 
      className="fixed inset-0 pointer-events-none transition-all duration-[2000ms] ease-in-out"
      style={{ 
        background: `
          radial-gradient(circle at 25% 25%, ${colors.primary} 0%, transparent 50%),
          radial-gradient(circle at 75% 75%, ${colors.secondary} 0%, transparent 50%),
          radial-gradient(circle at 50% 50%, ${colors.accent} 0%, transparent 70%)
        `,
        filter: 'blur(60px)',
        zIndex: -2
      }}
    />
  )
}

export default TimeAwareGlass