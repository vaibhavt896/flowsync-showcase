import { useEffect, useState, createContext, useContext, ReactNode } from 'react'
import { motion } from 'framer-motion'

export type BlurIntensity = 'light' | 'medium' | 'heavy' | 'extreme'

interface BlurContextType {
  currentIntensity: BlurIntensity
  setBlurIntensity: (intensity: BlurIntensity) => void
  isTransitioning: boolean
}

const BlurContext = createContext<BlurContextType | undefined>(undefined)

export function useBlur() {
  const context = useContext(BlurContext)
  if (!context) {
    throw new Error('useBlur must be used within a BlurProvider')
  }
  return context
}

interface BlurProviderProps {
  children: ReactNode
}

export function BlurProvider({ children }: BlurProviderProps) {
  const [currentIntensity, setCurrentIntensity] = useState<BlurIntensity>('medium')
  const [isTransitioning, setIsTransitioning] = useState(false)

  const setBlurIntensity = (intensity: BlurIntensity) => {
    if (intensity === currentIntensity) return
    
    setIsTransitioning(true)
    setCurrentIntensity(intensity)
    
    // Update CSS custom property
    document.documentElement.style.setProperty('--blur-current', 
      getBlurValue(intensity)
    )
    
    setTimeout(() => setIsTransitioning(false), 600)
  }

  const getBlurValue = (intensity: BlurIntensity): string => {
    switch (intensity) {
      case 'light': return 'blur(10px)'
      case 'medium': return 'blur(25px)'
      case 'heavy': return 'blur(50px)'
      case 'extreme': return 'blur(80px)'
      default: return 'blur(25px)'
    }
  }

  // Initialize CSS variable
  useEffect(() => {
    document.documentElement.style.setProperty('--blur-current', 
      getBlurValue(currentIntensity)
    )
  }, [])

  return (
    <BlurContext.Provider value={{
      currentIntensity,
      setBlurIntensity,
      isTransitioning
    }}>
      {children}
    </BlurContext.Provider>
  )
}

interface DynamicBlurSurfaceProps {
  children: ReactNode
  className?: string
  hoverIntensity?: BlurIntensity
  focusIntensity?: BlurIntensity
  restIntensity?: BlurIntensity
  disabled?: boolean
}

export function DynamicBlurSurface({
  children,
  className = '',
  hoverIntensity = 'light',
  focusIntensity = 'heavy',
  restIntensity = 'medium',
  disabled = false
}: DynamicBlurSurfaceProps) {
  const { setBlurIntensity } = useBlur()
  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const handleMouseEnter = () => {
    if (!disabled) {
      setIsHovered(true)
      setBlurIntensity(hoverIntensity)
    }
  }

  const handleMouseLeave = () => {
    if (!disabled) {
      setIsHovered(false)
      if (!isFocused) {
        setBlurIntensity(restIntensity)
      }
    }
  }

  const handleFocus = () => {
    if (!disabled) {
      setIsFocused(true)
      setBlurIntensity(focusIntensity)
    }
  }

  const handleBlur = () => {
    if (!disabled) {
      setIsFocused(false)
      if (!isHovered) {
        setBlurIntensity(restIntensity)
      }
    }
  }

  return (
    <motion.div
      className={`blur-dynamic ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      data-intensity={isFocused ? focusIntensity : isHovered ? hoverIntensity : restIntensity}
      transition={{
        backdropFilter: { duration: 0.6, ease: "easeInOut" }
      }}
    >
      {children}
    </motion.div>
  )
}

// Hook for programmatic blur control
export function useBlurController() {
  const { currentIntensity, setBlurIntensity, isTransitioning } = useBlur()

  const triggerBlurPulse = (intensity: BlurIntensity, duration: number = 1000) => {
    const originalIntensity = currentIntensity
    setBlurIntensity(intensity)
    setTimeout(() => setBlurIntensity(originalIntensity), duration)
  }

  const smoothBlurTransition = (fromIntensity: BlurIntensity, toIntensity: BlurIntensity, steps: number = 5) => {
    const intensities: BlurIntensity[] = ['light', 'medium', 'heavy', 'extreme']
    const fromIndex = intensities.indexOf(fromIntensity)
    const toIndex = intensities.indexOf(toIntensity)
    
    const stepSize = (toIndex - fromIndex) / steps
    let currentStep = 0

    const animate = () => {
      if (currentStep >= steps) return

      const targetIndex = Math.round(fromIndex + stepSize * currentStep)
      const clampedIndex = Math.max(0, Math.min(3, targetIndex))
      setBlurIntensity(intensities[clampedIndex])
      
      currentStep++
      setTimeout(animate, 100)
    }

    animate()
  }

  return {
    currentIntensity,
    setBlurIntensity,
    triggerBlurPulse,
    smoothBlurTransition,
    isTransitioning
  }
}