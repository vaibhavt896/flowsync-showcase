import { useEffect, useState, useRef } from 'react'
import { useBreathing } from '../contexts/BreathingContext'

// Energy level calculation based on time of day
function getEnergyLevelForTime(hour: number): number {
  if (hour >= 6 && hour <= 10) return 1.0
  if (hour >= 10 && hour <= 12) return 0.9
  if (hour >= 12 && hour <= 17) return 0.8
  if (hour >= 17 && hour <= 20) return 0.6
  if (hour >= 20 && hour <= 22) return 0.4
  return 0.2
}

interface BreathingAnimationValues {
  scale: number
  opacity: number
  y: number
  x: number
  rotate: number
  pulse: number // 0-1 breathing cycle
  colorShift: number // For adaptive chromatics
  depth: number // Z-axis positioning
  magneticStrength: number // Cursor attraction intensity
}

interface PhysicsState {
  velocity: { x: number; y: number }
  acceleration: { x: number; y: number }
  mass: number
  damping: number
}

export function useBreathingAnimation(intensity: number = 1): BreathingAnimationValues {
  const { breathingState, breathingRate, transitionIntensity } = useBreathing()
  const physicsState = useRef<PhysicsState>({
    velocity: { x: 0, y: 0 },
    acceleration: { x: 0, y: 0 },
    mass: 1,
    damping: 0.98
  })
  
  const [animationValues, setAnimationValues] = useState<BreathingAnimationValues>({
    scale: 1,
    opacity: 1,
    y: 0,
    x: 0,
    rotate: 0,
    pulse: 0,
    colorShift: 0,
    depth: 0,
    magneticStrength: 0
  })

  useEffect(() => {
    let animationFrame: number
    let startTime = Date.now()

    const animate = () => {
      const currentTime = Date.now()
      const elapsed = (currentTime - startTime) / 1000 // seconds
      
      // Calculate breathing cycle (0-1) with scientific 432Hz base
      const baseFrequency = 432 / 1000 // Convert to Hz
      const breathingCycle = (Math.sin(elapsed * breathingRate * 2 * Math.PI) + 1) / 2
      const harmonicPulse = (Math.sin(elapsed * baseFrequency * 2 * Math.PI) + 1) / 2
      
      // Physics-based calculations
      const timeOfDay = new Date().getHours()
      const energyLevel = getEnergyLevelForTime(timeOfDay)
      
      // Apply physics to movement
      const physics = physicsState.current
      physics.acceleration.x = (Math.sin(elapsed * 0.1) * 0.01) - (physics.velocity.x * 0.1)
      physics.acceleration.y = (Math.cos(elapsed * 0.08) * 0.01) - (physics.velocity.y * 0.1)
      physics.velocity.x += physics.acceleration.x
      physics.velocity.y += physics.acceleration.y
      physics.velocity.x *= physics.damping
      physics.velocity.y *= physics.damping
      
      // Base breathing values with physics
      let baseScale = 1
      let baseOpacity = 1
      let baseY = 0
      let baseX = 0
      let baseRotate = 0
      let colorShift = 0
      let depth = 0
      let magneticStrength = 0
      
      // Micro-movements (always present for physics-based feel)
      const microTime = elapsed * 0.3 // Slower micro-movements
      const microScale = 1 + (Math.sin(microTime * 1.7) * 0.002 * intensity)
      const microY = Math.sin(microTime * 1.3) * 0.5 * intensity
      const microRotate = Math.sin(microTime * 0.8) * 0.2 * intensity
      
      switch (breathingState) {
        case 'focus':
          // Calm, steady breathing at 0.1Hz (6 breaths/minute)
          const focusRate = 0.1
          const focusCycle = (Math.sin(elapsed * focusRate * 2 * Math.PI) + 1) / 2
          baseScale = 1 + (focusCycle * 0.015 * intensity * energyLevel) // Even more subtle
          baseOpacity = 0.98 + (focusCycle * 0.02 * intensity)
          baseY = focusCycle * 0.5 * intensity
          baseX = Math.sin(elapsed * 0.05) * 0.2 * intensity // Micro-drift
          depth = -focusCycle * 2 // Slight depth movement
          colorShift = focusCycle * 5 // Subtle hue shift
          magneticStrength = 0.3 + (energyLevel * 0.2) // Adaptive assistance
          break
          
        case 'transition':
          // Gradually increases to 0.15Hz as approaching break
          const transitionRate = 0.1 + (transitionIntensity * 0.05)
          const transitionCycle = (Math.sin(elapsed * transitionRate * 2 * Math.PI) + 1) / 2
          const transitionFactor = 1 + transitionIntensity * 0.3
          baseScale = 1 + (transitionCycle * 0.025 * intensity * transitionFactor)
          baseOpacity = 0.92 + (transitionCycle * 0.08 * intensity)
          baseY = transitionCycle * 1.2 * intensity * transitionFactor
          baseX = Math.sin(elapsed * 0.08) * 0.5 * intensity * transitionIntensity
          baseRotate = transitionCycle * 0.3 * intensity * transitionIntensity
          depth = -transitionCycle * 3 * transitionFactor
          colorShift = 15 + (transitionCycle * 10) // Warm shift
          magneticStrength = 0.4 + (transitionIntensity * 0.3)
          break
          
        case 'break':
          // Free-flowing, organic movements that mirror rest states
          const organicTime = elapsed * 0.4
          const restPattern1 = Math.sin(organicTime * 0.6) + Math.cos(organicTime * 0.3)
          const restPattern2 = Math.sin(organicTime * 0.8) + Math.cos(organicTime * 0.5)
          baseScale = 1 + (restPattern1 * 0.06 * intensity)
          baseOpacity = 0.7 + (restPattern2 * 0.3 * intensity)
          baseY = restPattern1 * 4 * intensity + Math.cos(organicTime * 0.4) * 2 * intensity
          baseX = restPattern2 * 3 * intensity + Math.sin(organicTime * 0.25) * 1.5 * intensity
          baseRotate = Math.sin(organicTime * 0.35) * 3 * intensity
          depth = restPattern1 * 5 // More dramatic depth changes
          colorShift = -10 + (restPattern2 * 20) // Cool to warm shifts
          magneticStrength = 0.1 // Reduced during break
          break
          
        case 'idle':
        default:
          // Gentle, neutral breathing
          baseScale = 1 + (breathingCycle * 0.015 * intensity)
          baseOpacity = 0.95 + (breathingCycle * 0.05 * intensity)
          baseY = breathingCycle * 0.5 * intensity
          baseX = Math.sin(elapsed * 0.03) * 0.1 * intensity
          depth = -breathingCycle * 1
          colorShift = breathingCycle * 3
          magneticStrength = 0.2
          break
      }
      
      // Combine base animations with micro-movements and physics
      setAnimationValues({
        scale: baseScale * microScale,
        opacity: Math.max(0.1, Math.min(1, baseOpacity)),
        y: baseY + microY + physics.velocity.y * 10,
        x: baseX + physics.velocity.x * 10,
        rotate: baseRotate + microRotate,
        pulse: breathingCycle,
        colorShift: colorShift + (harmonicPulse * 2),
        depth: depth,
        magneticStrength: magneticStrength
      })
      
      animationFrame = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [breathingState, breathingRate, transitionIntensity, intensity])

  return animationValues
}

// Hook for particle systems and background elements
export function useOrganicMovement(complexity: number = 1) {
  const { breathingState } = useBreathing()
  const [position, setPosition] = useState({ x: 0, y: 0, rotation: 0, scale: 1 })

  useEffect(() => {
    let animationFrame: number
    let startTime = Date.now()

    const animate = () => {
      const currentTime = Date.now()
      const elapsed = (currentTime - startTime) / 1000

      let movement = { x: 0, y: 0, rotation: 0, scale: 1 }

      switch (breathingState) {
        case 'focus':
          // Minimal, controlled movement
          movement.x = Math.sin(elapsed * 0.2) * 2 * complexity
          movement.y = Math.cos(elapsed * 0.15) * 1 * complexity
          movement.rotation = Math.sin(elapsed * 0.1) * 1 * complexity
          movement.scale = 1 + Math.sin(elapsed * 0.3) * 0.02 * complexity
          break

        case 'transition':
          // Slightly more dynamic
          movement.x = Math.sin(elapsed * 0.3) * 3 * complexity
          movement.y = Math.cos(elapsed * 0.25) * 2 * complexity
          movement.rotation = Math.sin(elapsed * 0.2) * 2 * complexity
          movement.scale = 1 + Math.sin(elapsed * 0.4) * 0.03 * complexity
          break

        case 'break':
          // Free-flowing, organic movement
          movement.x = Math.sin(elapsed * 0.4) * 8 * complexity + Math.cos(elapsed * 0.7) * 3 * complexity
          movement.y = Math.cos(elapsed * 0.5) * 6 * complexity + Math.sin(elapsed * 0.3) * 2 * complexity
          movement.rotation = Math.sin(elapsed * 0.6) * 5 * complexity
          movement.scale = 1 + Math.sin(elapsed * 0.8) * 0.1 * complexity
          break

        case 'idle':
        default:
          // Gentle movement
          movement.x = Math.sin(elapsed * 0.25) * 1.5 * complexity
          movement.y = Math.cos(elapsed * 0.2) * 1 * complexity
          movement.rotation = Math.sin(elapsed * 0.15) * 0.5 * complexity
          movement.scale = 1 + Math.sin(elapsed * 0.35) * 0.015 * complexity
          break
      }

      setPosition(movement)
      animationFrame = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [breathingState, complexity])

  return position
}

// Hook for text elements that should breathe subtly
export function useTextBreathing(intensity: number = 0.5) {
  const breathing = useBreathingAnimation(intensity)
  
  return {
    transform: `translateY(${breathing.y * 0.3}px) scale(${breathing.scale})`,
    opacity: breathing.opacity,
    transition: 'none' // Disable CSS transitions to allow smooth JS animation
  }
}

// Hook for card elements with physics-based movement
export function useCardBreathing(intensity: number = 1) {
  const breathing = useBreathingAnimation(intensity)
  
  return {
    transform: `translateY(${breathing.y}px) scale(${breathing.scale}) rotate(${breathing.rotate * 0.1}deg)`,
    opacity: breathing.opacity,
    transition: 'none'
  }
}

// Hook for background elements
export function useBackgroundBreathing() {
  const breathing = useBreathingAnimation(0.3)
  const organic = useOrganicMovement(0.5)
  
  return {
    transform: `translate(${organic.x}px, ${organic.y}px) scale(${organic.scale}) rotate(${organic.rotation}deg)`,
    opacity: breathing.opacity * 0.6,
    transition: 'none'
  }
}

// Hook for cursor magnetic effects
export function useMagneticCursor(elementRef: React.RefObject<HTMLElement>) {
  const breathing = useBreathingAnimation(1)
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const distance = Math.sqrt(Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2))
      const maxDistance = 100
      const strength = breathing.magneticStrength

      if (distance < maxDistance) {
        const pull = (1 - distance / maxDistance) * strength
        const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX)
        setCursorPosition({
          x: Math.cos(angle) * pull * 10,
          y: Math.sin(angle) * pull * 10
        })
        setIsHovering(true)
      } else {
        setIsHovering(false)
      }
    }

    const handleMouseLeave = () => {
      setCursorPosition({ x: 0, y: 0 })
      setIsHovering(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    element.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      element.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [breathing.magneticStrength])

  return {
    transform: `translate(${cursorPosition.x}px, ${cursorPosition.y}px)`,
    transition: isHovering ? 'none' : 'transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    isHovering
  }
}