/**
 * The Productivity Aurora
 * Flowing aurora at top of screen based on productivity metrics
 */

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { useTimerStore } from '@/stores/timerStore'
import { useFlowStore } from '@/stores/flowStore'
import { AdaptiveChromatics } from '@/systems/adaptiveChromatics'
import { ParticleSystem, Particle, VortexForce, AnimationController } from '@/systems/physicsEngine'

interface AuroraMetrics {
  currentProductivity: number
  historicalAverage: number
  flowIntensity: number
  optimalWindow: number
  teamSync: number // Future: team flow states
  globalTrends: number // Future: global productivity
}

export default function ProductivityAurora() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { getTodaySessions, sessionHistory } = useTimerStore()
  const { currentFlowState, getFlowHistory } = useFlowStore()
  
  const [chromatics] = useState(() => new AdaptiveChromatics())
  const [particleSystem] = useState(() => new ParticleSystem(150))
  const [animationController] = useState(() => new AnimationController(60))
  
  // Motion values for reactive aurora
  const productivityMotion = useMotionValue(0)
  const flowMotion = useMotionValue(0)
  const timeMotion = useMotionValue(0)
  
  // Calculate current metrics
  const calculateMetrics = (): AuroraMetrics => {
    const todaySessions = getTodaySessions()
    const recentFlow = getFlowHistory(6) // Last 6 hours
    
    // Current productivity (0-1)
    const completedToday = todaySessions.filter(s => s.isCompleted).length
    const currentProductivity = Math.min(1, completedToday / 8) // Normalized to 8 sessions
    
    // Historical average (last 7 days)
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
    const historicalSessions = sessionHistory.filter(s => 
      new Date(s.startTime).getTime() > weekAgo
    )
    const avgDailySessions = historicalSessions.length / 7
    const historicalAverage = Math.min(1, avgDailySessions / 8)
    
    // Flow intensity
    const currentFlow = currentFlowState?.flowScore || 0
    const recentFlowAvg = recentFlow.length > 0
      ? recentFlow.reduce((sum, f) => sum + (f.flowScore || 0), 0) / recentFlow.length
      : 0
    const flowIntensity = Math.max(currentFlow, recentFlowAvg)
    
    // Optimal window detection (based on historical patterns)
    const hour = new Date().getHours()
    const hourlyProductivity = Array.from({ length: 24 }, (_, h) => {
      const hourSessions = historicalSessions.filter(s => 
        new Date(s.startTime).getHours() === h && s.isCompleted
      )
      return hourSessions.length
    })
    const maxHourly = Math.max(...hourlyProductivity)
    const optimalWindow = maxHourly > 0 ? hourlyProductivity[hour] / maxHourly : 0.5
    
    return {
      currentProductivity,
      historicalAverage,
      flowIntensity,
      optimalWindow,
      teamSync: 0.5, // Placeholder for future team features
      globalTrends: 0.6 // Placeholder for global trends
    }
  }
  
  const [metrics, setMetrics] = useState<AuroraMetrics>(calculateMetrics)
  
  // Update metrics periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(calculateMetrics())
    }, 30000) // Update every 30 seconds
    
    return () => clearInterval(interval)
  }, [sessionHistory, currentFlowState])
  
  // Update motion values
  useEffect(() => {
    productivityMotion.set(metrics.currentProductivity)
    flowMotion.set(metrics.flowIntensity)
    
    // Time-based motion (0-1 throughout day)
    const timeOfDay = new Date().getHours() / 24
    timeMotion.set(timeOfDay)
  }, [metrics])
  
  // Aurora wave transforms
  const primaryWave = useTransform(productivityMotion, [0, 1], [0, 100])
  const secondaryWave = useTransform(flowMotion, [0, 1], [0, 80])
  const timeWave = useTransform(timeMotion, [0, 1], [0, 360])
  
  // Initialize aurora particles
  useEffect(() => {
    if (!canvasRef.current) return
    
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    
    // Create aurora particles
    for (let i = 0; i < 100; i++) {
      const particle = new Particle(
        {
          x: Math.random() * rect.width,
          y: Math.random() * rect.height * 0.3, // Top 30% of screen
          z: Math.random() * 100
        },
        {
          x: (Math.random() - 0.5) * 0.5,
          y: Math.random() * 0.2,
          z: 0
        },
        Math.random() * 2 + 1, // life
        Math.random() * 3 + 1, // size
        chromatics.getColor('flow')
      )
      
      particleSystem.addParticle(particle)
    }
    
    // Add gentle forces
    particleSystem.addForce(new VortexForce(
      { x: rect.width / 2, y: rect.height * 0.15, z: 0 },
      0.1, // gentle strength
      rect.width // large radius
    ))
    
  }, [chromatics, particleSystem])
  
  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Set canvas size
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * devicePixelRatio
      canvas.height = rect.height * devicePixelRatio
      ctx.scale(devicePixelRatio, devicePixelRatio)
    }
    
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    
    const render = (deltaTime: number) => {
      // Update particles
      particleSystem.update(deltaTime / 1000)
      
      // Update chromatics
      chromatics.updateFactors({
        productivity: (metrics.currentProductivity - metrics.historicalAverage),
        flowState: metrics.flowIntensity,
        timeOfDay: new Date().getHours(),
        sessionLength: 0, // Will be updated by timer
      })
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width / devicePixelRatio, canvas.height / devicePixelRatio)
      
      // Render aurora background gradients
      renderAuroraBackground(ctx, canvas)
      
      // Render particles
      renderParticles(ctx)
      
      // Render productivity indicators
      renderProductivityIndicators(ctx, canvas)
    }
    
    animationController.start(render)
    
    return () => {
      animationController.stop()
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [metrics, chromatics, particleSystem, animationController])
  
  const renderAuroraBackground = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const width = canvas.width / devicePixelRatio
    const height = canvas.height / devicePixelRatio
    
    // Create flowing gradient based on productivity
    const gradient = ctx.createLinearGradient(0, 0, width, height * 0.3)
    
    // Colors based on current state
    const primaryColor = chromatics.getColorWithOpacity('flow', 0.3)
    const secondaryColor = chromatics.getColorWithOpacity('focus', 0.2)
    const accentColor = chromatics.getColorWithOpacity('success', 0.1)
    
    gradient.addColorStop(0, primaryColor)
    gradient.addColorStop(0.5, secondaryColor)
    gradient.addColorStop(1, accentColor)
    
    // Animated wave pattern
    ctx.fillStyle = gradient
    ctx.beginPath()
    
    const waveHeight = 60 + metrics.currentProductivity * 40
    const waveFreq = 0.01 + metrics.flowIntensity * 0.005
    const time = Date.now() * 0.001
    
    ctx.moveTo(0, height * 0.2)
    
    for (let x = 0; x <= width; x += 2) {
      const y = height * 0.2 + 
        Math.sin(x * waveFreq + time) * waveHeight * 0.5 +
        Math.sin(x * waveFreq * 2 + time * 1.5) * waveHeight * 0.3 +
        Math.sin(x * waveFreq * 0.5 + time * 0.8) * waveHeight * 0.2
      
      ctx.lineTo(x, y)
    }
    
    ctx.lineTo(width, 0)
    ctx.lineTo(0, 0)
    ctx.closePath()
    ctx.fill()
  }
  
  const renderParticles = (ctx: CanvasRenderingContext2D) => {
    const particles = particleSystem.getParticleData()
    
    particles.forEach(particle => {
      ctx.save()
      ctx.globalAlpha = particle.opacity * 0.6
      
      // Dynamic color based on position and metrics
      const hue = 200 + (particle.x / window.innerWidth) * 80 + metrics.flowIntensity * 30
      ctx.fillStyle = `hsl(${hue}, 60%, 60%)`
      
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      ctx.fill()
      
      // Add glow effect for high flow states
      if (metrics.flowIntensity > 0.7) {
        ctx.shadowBlur = 10
        ctx.shadowColor = ctx.fillStyle
        ctx.fill()
      }
      
      ctx.restore()
    })
  }
  
  const renderProductivityIndicators = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const width = canvas.width / devicePixelRatio
    
    // Productivity bar at top
    const barHeight = 3
    const barY = 10
    
    // Background bar
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'
    ctx.fillRect(20, barY, width - 40, barHeight)
    
    // Progress bar
    const progress = metrics.currentProductivity
    const progressWidth = (width - 40) * progress
    
    const progressGradient = ctx.createLinearGradient(20, 0, 20 + progressWidth, 0)
    progressGradient.addColorStop(0, chromatics.getColor('success'))
    progressGradient.addColorStop(1, chromatics.getColor('flow'))
    
    ctx.fillStyle = progressGradient
    ctx.fillRect(20, barY, progressWidth, barHeight)
    
    // Optimal window indicator
    if (metrics.optimalWindow > 0.8) {
      ctx.fillStyle = chromatics.getColorWithOpacity('success', 0.8)
      ctx.font = '12px Inter, sans-serif'
      ctx.fillText('⚡ Optimal Focus Window', width - 180, 25)
    }
  }
  
  // Update chromatics when component mounts
  useEffect(() => {
    chromatics.applyToDocument()
    
    return () => {
      chromatics.destroy()
    }
  }, [chromatics])
  
  return (
    <div className="fixed top-0 left-0 right-0 h-32 pointer-events-none z-10 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{
          background: 'transparent',
          mixBlendMode: 'normal'
        }}
      />
      
      {/* Productivity metrics overlay */}
      <motion.div
        className="absolute top-4 right-4 text-xs text-white/60 font-mono"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div>Productivity: {Math.round(metrics.currentProductivity * 100)}%</div>
        <div>Flow: {Math.round(metrics.flowIntensity * 100)}%</div>
        {metrics.optimalWindow > 0.8 && (
          <motion.div
            className="text-emerald-400"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ⚡ Peak Window
          </motion.div>
        )}
      </motion.div>
      
      {/* Breathing inspiration indicator */}
      {metrics.flowIntensity < 0.3 && (
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.4, 0.7, 0.4]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center">
            <div className="text-white/60 text-xs">Breathe</div>
          </div>
        </motion.div>
      )}
    </div>
  )
}