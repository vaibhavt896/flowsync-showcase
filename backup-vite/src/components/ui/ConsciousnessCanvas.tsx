import { useEffect, useRef, useState } from 'react'
import { useBreathing } from '../../contexts/BreathingContext'
import { useBreathingAnimation } from '../../hooks/useBreathingAnimation'

interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  hue: number
  targetX?: number
  targetY?: number
  mass: number
  energy: number
  clustered: boolean
}

interface ConsciousnessCanvasProps {
  particleCount?: number
  interactive?: boolean
  showConstellations?: boolean
}

export function ConsciousnessCanvas({ 
  particleCount = 3000, 
  interactive = true, 
  showConstellations = true 
}: ConsciousnessCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationFrameRef = useRef<number>()
  const mouseRef = useRef({ x: 0, y: 0, isActive: false })
  const { breathingState, breathingRate } = useBreathing()
  const breathing = useBreathingAnimation(0.5)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  // Initialize particles
  useEffect(() => {
    const initializeParticles = () => {
      const particles: Particle[] = []
      const { width, height } = dimensions

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          id: i,
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.8 + 0.2,
          hue: Math.random() * 60 + 200, // Blue-purple range
          mass: Math.random() * 0.5 + 0.5,
          energy: Math.random() * 0.5 + 0.5,
          clustered: false
        })
      }

      particlesRef.current = particles
    }

    if (dimensions.width > 0 && dimensions.height > 0) {
      initializeParticles()
    }
  }, [particleCount, dimensions])

  // Handle canvas resize
  useEffect(() => {
    const updateDimensions = () => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect()
        setDimensions({ width: rect.width, height: rect.height })
        canvasRef.current.width = rect.width
        canvasRef.current.height = rect.height
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  // Mouse interaction
  useEffect(() => {
    if (!interactive) return

    const handleMouseMove = (e: MouseEvent) => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect()
        mouseRef.current = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
          isActive: true
        }
      }
    }

    const handleMouseLeave = () => {
      mouseRef.current.isActive = false
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [interactive])

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const animate = () => {
      const { width, height } = dimensions
      if (width === 0 || height === 0) {
        animationFrameRef.current = requestAnimationFrame(animate)
        return
      }

      // Clear canvas with breathing background
      ctx.fillStyle = getBackgroundForState()
      ctx.fillRect(0, 0, width, height)

      const particles = particlesRef.current
      const mouse = mouseRef.current
      const timeOfDay = new Date().getHours()
      const energyLevel = getEnergyLevel(timeOfDay)

      // Calculate clustering behavior based on breathing state
      const shouldCluster = breathingState === 'focus'
      const clusterStrength = getClusterStrength()
      const clusterCenter = { x: width / 2, y: height / 2 }

      particles.forEach((particle, index) => {
        // Apply breathing-based forces
        applyBreathingForces(particle, breathing)
        
        // Mouse gravitational effect
        if (mouse.isActive && interactive) {
          applyMouseGravity(particle, mouse)
        }

        // Clustering behavior for focus state
        if (shouldCluster) {
          applyClusteringForce(particle, clusterCenter, clusterStrength)
        } else {
          // Disperse during breaks
          applyDispersionForce(particle, clusterCenter)
        }

        // Particle-to-particle interactions
        applyParticleInteractions(particle, particles, index)

        // Update position
        particle.x += particle.vx
        particle.y += particle.vy

        // Boundary conditions with soft wrapping
        if (particle.x < 0) particle.x = width
        if (particle.x > width) particle.x = 0
        if (particle.y < 0) particle.y = height
        if (particle.y > height) particle.y = 0

        // Apply damping
        particle.vx *= 0.995
        particle.vy *= 0.995

        // Draw particle
        drawParticle(ctx, particle, energyLevel)
      })

      // Draw constellation connections
      if (showConstellations && breathingState === 'focus') {
        drawConstellations(ctx, particles)
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [dimensions, breathingState, breathing, interactive, showConstellations])

  // Helper functions
  const getEnergyLevel = (hour: number): number => {
    if (hour >= 6 && hour <= 10) return 1.0
    if (hour >= 10 && hour <= 12) return 0.9
    if (hour >= 12 && hour <= 17) return 0.8
    if (hour >= 17 && hour <= 20) return 0.6
    if (hour >= 20 && hour <= 22) return 0.4
    return 0.2
  }

  const getBackgroundForState = (): string => {
    const baseAlpha = 0.02 + breathing.pulse * 0.01
    switch (breathingState) {
      case 'focus':
        return `rgba(16, 185, 129, ${baseAlpha})`
      case 'transition':
        return `rgba(245, 158, 11, ${baseAlpha})`
      case 'break':
        return `rgba(59, 130, 246, ${baseAlpha})`
      default:
        return `rgba(107, 114, 128, ${baseAlpha})`
    }
  }

  const getClusterStrength = (): number => {
    switch (breathingState) {
      case 'focus':
        return 0.0008 * (1 + breathing.pulse * 0.3)
      case 'transition':
        return 0.0004
      default:
        return 0
    }
  }

  const applyBreathingForces = (particle: Particle, breathing: any) => {
    const breathingForce = breathing.pulse * 0.1
    particle.vx += (Math.random() - 0.5) * breathingForce * 0.1
    particle.vy += (Math.random() - 0.5) * breathingForce * 0.1
    
    // Size breathing
    particle.size = (particle.size * 0.99) + ((0.5 + breathing.pulse * 0.5) * 0.01)
  }

  const applyMouseGravity = (particle: Particle, mouse: { x: number; y: number }) => {
    const dx = mouse.x - particle.x
    const dy = mouse.y - particle.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    const maxDistance = 150

    if (distance < maxDistance && distance > 0) {
      const force = (1 - distance / maxDistance) * 0.002
      particle.vx += (dx / distance) * force
      particle.vy += (dy / distance) * force
    }
  }

  const applyClusteringForce = (particle: Particle, center: { x: number; y: number }, strength: number) => {
    const dx = center.x - particle.x
    const dy = center.y - particle.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance > 0) {
      particle.vx += (dx / distance) * strength * particle.energy
      particle.vy += (dy / distance) * strength * particle.energy
      particle.clustered = true
    }
  }

  const applyDispersionForce = (particle: Particle, center: { x: number; y: number }) => {
    const dx = center.x - particle.x
    const dy = center.y - particle.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance > 0 && distance < 200) {
      const force = 0.0005
      particle.vx -= (dx / distance) * force
      particle.vy -= (dy / distance) * force
      particle.clustered = false
    }
  }

  const applyParticleInteractions = (particle: Particle, particles: Particle[], index: number) => {
    // Check nearby particles for flocking behavior
    let neighborCount = 0
    let avgVx = 0
    let avgVy = 0
    let separationX = 0
    let separationY = 0

    particles.forEach((other, otherIndex) => {
      if (index === otherIndex) return

      const dx = other.x - particle.x
      const dy = other.y - particle.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < 50 && distance > 0) {
        neighborCount++
        avgVx += other.vx
        avgVy += other.vy

        // Separation
        if (distance < 20) {
          separationX -= dx / distance
          separationY -= dy / distance
        }
      }
    })

    if (neighborCount > 0) {
      // Alignment
      avgVx /= neighborCount
      avgVy /= neighborCount
      particle.vx += (avgVx - particle.vx) * 0.002
      particle.vy += (avgVy - particle.vy) * 0.002

      // Separation
      particle.vx += separationX * 0.001
      particle.vy += separationY * 0.001
    }
  }

  const drawParticle = (ctx: CanvasRenderingContext2D, particle: Particle, energyLevel: number) => {
    const alpha = particle.opacity * energyLevel * (0.3 + breathing.pulse * 0.4)
    const hue = particle.hue + breathing.colorShift
    
    ctx.save()
    ctx.globalAlpha = alpha
    
    // Create gradient for particle
    const gradient = ctx.createRadialGradient(
      particle.x, particle.y, 0,
      particle.x, particle.y, particle.size * 2
    )
    gradient.addColorStop(0, `hsla(${hue}, 70%, 60%, 1)`)
    gradient.addColorStop(1, `hsla(${hue}, 70%, 60%, 0)`)
    
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
    ctx.fill()
    
    // Add subtle glow during focus
    if (breathingState === 'focus' && particle.clustered) {
      ctx.shadowBlur = 10
      ctx.shadowColor = `hsla(${hue}, 70%, 60%, 0.5)`
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size * 0.5, 0, Math.PI * 2)
      ctx.fill()
    }
    
    ctx.restore()
  }

  const drawConstellations = (ctx: CanvasRenderingContext2D, particles: Particle[]) => {
    ctx.save()
    ctx.globalAlpha = 0.1 + breathing.pulse * 0.1
    ctx.strokeStyle = `hsla(${200 + breathing.colorShift}, 50%, 70%, 0.3)`
    ctx.lineWidth = 0.5

    // Connect nearby clustered particles
    particles.forEach((particle, index) => {
      if (!particle.clustered) return

      particles.slice(index + 1).forEach(other => {
        if (!other.clustered) return

        const dx = other.x - particle.x
        const dy = other.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 100) {
          const alpha = (1 - distance / 100) * 0.3
          ctx.globalAlpha = alpha
          ctx.beginPath()
          ctx.moveTo(particle.x, particle.y)
          ctx.lineTo(other.x, other.y)
          ctx.stroke()
        }
      })
    })

    ctx.restore()
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none -z-10"
      style={{
        width: '100%',
        height: '100%',
        background: 'transparent'
      }}
    />
  )
}

export default ConsciousnessCanvas