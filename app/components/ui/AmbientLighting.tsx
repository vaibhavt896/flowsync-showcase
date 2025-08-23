import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'

interface AmbientLightingProps {
  intensity?: number
  colorTemperature?: 'cool' | 'neutral' | 'warm'
  followMouse?: boolean
  breathingEffect?: boolean
  className?: string
}

export function AmbientLighting({
  intensity = 0.3,
  colorTemperature = 'neutral',
  followMouse = true,
  breathingEffect = true,
  className = ''
}: AmbientLightingProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  // Transform mouse position to light position
  const lightX = useTransform(mouseX, [0, window.innerWidth], [10, 90])
  const lightY = useTransform(mouseY, [0, window.innerHeight], [10, 90])

  useEffect(() => {
    if (!followMouse) return

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
      setMousePos({ x: e.clientX, y: e.clientY })
    }

    document.addEventListener('mousemove', handleMouseMove)
    return () => document.removeEventListener('mousemove', handleMouseMove)
  }, [followMouse, mouseX, mouseY])

  const getColorTemperatureGradient = (temp: string) => {
    switch (temp) {
      case 'cool':
        return {
          primary: 'rgba(59, 130, 246, 0.4)',
          secondary: 'rgba(147, 197, 253, 0.3)',
          accent: 'rgba(191, 219, 254, 0.2)'
        }
      case 'warm':
        return {
          primary: 'rgba(251, 146, 60, 0.4)',
          secondary: 'rgba(253, 186, 116, 0.3)',
          accent: 'rgba(254, 215, 170, 0.2)'
        }
      default: // neutral
        return {
          primary: 'rgba(156, 163, 175, 0.4)',
          secondary: 'rgba(209, 213, 219, 0.3)',
          accent: 'rgba(243, 244, 246, 0.2)'
        }
    }
  }

  const colors = getColorTemperatureGradient(colorTemperature)

  return (
    <div 
      ref={containerRef}
      className={`fixed inset-0 pointer-events-none overflow-hidden ${className}`}
      style={{ zIndex: -1 }}
    >
      {/* Primary ambient light following mouse */}
      {followMouse && (
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 600,
            height: 600,
            x: lightX,
            y: lightY,
            background: `radial-gradient(circle, ${colors.primary} 0%, ${colors.secondary} 30%, transparent 70%)`,
            filter: 'blur(40px)',
            transform: 'translate(-50%, -50%)'
          }}
          animate={{
            scale: breathingEffect ? [1, 1.2, 1] : 1,
            opacity: [intensity, intensity * 1.5, intensity]
          }}
          transition={{
            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            opacity: { duration: 3, repeat: Infinity, ease: "easeInOut" }
          }}
        />
      )}

      {/* Secondary ambient layers */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 20% 20%, ${colors.accent} 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, ${colors.secondary} 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, ${colors.primary} 0%, transparent 70%)
          `,
          filter: 'blur(60px)'
        }}
        animate={{
          opacity: [intensity * 0.5, intensity * 0.8, intensity * 0.5]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Atmospheric particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 4 + 2,
            height: Math.random() * 4 + 2,
            background: colors.accent,
            filter: 'blur(1px)'
          }}
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: 0
          }}
          animate={{
            x: [
              Math.random() * window.innerWidth,
              Math.random() * window.innerWidth,
              Math.random() * window.innerWidth
            ],
            y: [
              Math.random() * window.innerHeight,
              Math.random() * window.innerHeight,
              Math.random() * window.innerHeight
            ],
            opacity: [0, intensity * 0.6, 0]
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "linear"
          }}
        />
      ))}

      {/* Interactive light burst on click */}
      <InteractiveLightBurst colors={colors} intensity={intensity} />
    </div>
  )
}

function InteractiveLightBurst({ 
  colors, 
  intensity 
}: { 
  colors: any
  intensity: number 
}) {
  const [bursts, setBursts] = useState<Array<{ id: number; x: number; y: number }>>([])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const newBurst = {
        id: Date.now(),
        x: e.clientX,
        y: e.clientY
      }

      setBursts(prev => [...prev, newBurst])

      // Remove burst after animation
      setTimeout(() => {
        setBursts(prev => prev.filter(burst => burst.id !== newBurst.id))
      }, 1000)
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  return (
    <>
      {bursts.map((burst) => (
        <motion.div
          key={burst.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: burst.x,
            top: burst.y,
            width: 200,
            height: 200,
            background: `radial-gradient(circle, ${colors.primary} 0%, transparent 70%)`,
            filter: 'blur(30px)',
            transform: 'translate(-50%, -50%)'
          }}
          initial={{
            scale: 0,
            opacity: intensity * 2
          }}
          animate={{
            scale: [0, 2, 0],
            opacity: [intensity * 2, intensity * 0.5, 0]
          }}
          transition={{
            duration: 1,
            ease: "easeOut"
          }}
        />
      ))}
    </>
  )
}

// Hook for controlling ambient lighting programmatically
export function useAmbientLighting() {
  const [settings, setSettings] = useState({
    intensity: 0.3,
    colorTemperature: 'neutral' as 'cool' | 'neutral' | 'warm',
    followMouse: true,
    breathingEffect: true
  })

  const updateSettings = (newSettings: Partial<typeof settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }))
  }

  const pulseIntensity = (targetIntensity: number, duration: number = 2000) => {
    const originalIntensity = settings.intensity
    updateSettings({ intensity: targetIntensity })
    
    setTimeout(() => {
      updateSettings({ intensity: originalIntensity })
    }, duration)
  }

  const cycleColorTemperature = () => {
    const temperatures: ('cool' | 'neutral' | 'warm')[] = ['cool', 'neutral', 'warm']
    const currentIndex = temperatures.indexOf(settings.colorTemperature)
    const nextIndex = (currentIndex + 1) % temperatures.length
    updateSettings({ colorTemperature: temperatures[nextIndex] })
  }

  return {
    settings,
    updateSettings,
    pulseIntensity,
    cycleColorTemperature
  }
}

export default AmbientLighting