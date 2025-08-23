import { useEffect, useRef, useState } from 'react'
import { useBreathing } from '../../../contexts/BreathingContext'
import { useTimerStore } from '../../../stores/timerStore'

interface DataPoint {
  x: number
  y: number
  intensity: number
  timestamp: number
  type: 'focus' | 'break' | 'distraction'
}

interface GenerativePattern {
  id: string
  points: DataPoint[]
  color: string
  opacity: number
  speed: number
}

export function AmbientDataLayer() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const { breathingState } = useBreathing()
  const { sessionsCompleted, totalFocusTime } = useTimerStore()
  const [patterns, setPatterns] = useState<GenerativePattern[]>([])

  // Generate productivity patterns as generative art
  useEffect(() => {
    const generatePatterns = () => {
      const newPatterns: GenerativePattern[] = []
      
      // Focus pattern - flowing waves
      const focusPoints: DataPoint[] = []
      for (let i = 0; i < 50; i++) {
        focusPoints.push({
          x: (i / 50) * window.innerWidth,
          y: window.innerHeight * 0.5 + Math.sin(i * 0.1) * 100,
          intensity: 0.6 + Math.random() * 0.4,
          timestamp: Date.now() - i * 60000,
          type: 'focus'
        })
      }
      
      newPatterns.push({
        id: 'focus-wave',
        points: focusPoints,
        color: '#10b981',
        opacity: 0.1,
        speed: 0.5
      })

      // Break pattern - gentle particles
      const breakPoints: DataPoint[] = []
      for (let i = 0; i < 30; i++) {
        breakPoints.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          intensity: 0.3 + Math.random() * 0.3,
          timestamp: Date.now() - i * 120000,
          type: 'break'
        })
      }
      
      newPatterns.push({
        id: 'break-particles',
        points: breakPoints,
        color: '#3b82f6',
        opacity: 0.08,
        speed: 0.2
      })

      // Distraction pattern - chaotic spikes
      const distractionPoints: DataPoint[] = []
      for (let i = 0; i < 20; i++) {
        distractionPoints.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          intensity: 0.2 + Math.random() * 0.8,
          timestamp: Date.now() - i * 90000,
          type: 'distraction'
        })
      }
      
      newPatterns.push({
        id: 'distraction-spikes',
        points: distractionPoints,
        color: '#ef4444',
        opacity: 0.05,
        speed: 1.2
      })

      setPatterns(newPatterns)
    }

    generatePatterns()
    
    // Regenerate patterns periodically
    const interval = setInterval(generatePatterns, 60000) // Every minute
    
    return () => clearInterval(interval)
  }, [sessionsCompleted, totalFocusTime])

  // Canvas animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resize()
    window.addEventListener('resize', resize)

    let startTime = Date.now()

    const animate = () => {
      const currentTime = Date.now()
      const elapsed = (currentTime - startTime) / 1000

      // Clear canvas with breathing opacity
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw generative patterns
      patterns.forEach(pattern => {
        const breathingOpacity = pattern.opacity * (0.8 + Math.sin(elapsed * 0.5) * 0.2)
        
        ctx.save()
        ctx.globalAlpha = breathingOpacity
        ctx.strokeStyle = pattern.color
        ctx.fillStyle = pattern.color

        switch (pattern.id) {
          case 'focus-wave':
            drawFocusWave(ctx, pattern, elapsed)
            break
          case 'break-particles':
            drawBreakParticles(ctx, pattern, elapsed)
            break
          case 'distraction-spikes':
            drawDistractionSpikes(ctx, pattern, elapsed)
            break
        }

        ctx.restore()
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [patterns])

  const drawFocusWave = (ctx: CanvasRenderingContext2D, pattern: GenerativePattern, elapsed: number) => {
    ctx.beginPath()
    ctx.lineWidth = 2
    
    pattern.points.forEach((point, index) => {
      const wave = Math.sin(elapsed * pattern.speed + index * 0.1) * 50
      const x = point.x + Math.sin(elapsed * 0.3) * 20
      const y = point.y + wave
      
      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    
    ctx.stroke()
  }

  const drawBreakParticles = (ctx: CanvasRenderingContext2D, pattern: GenerativePattern, elapsed: number) => {
    pattern.points.forEach(point => {
      const floatY = point.y + Math.sin(elapsed * pattern.speed + point.x * 0.01) * 30
      const floatX = point.x + Math.cos(elapsed * pattern.speed * 0.7 + point.y * 0.01) * 20
      const size = 3 + point.intensity * 5
      
      ctx.beginPath()
      ctx.arc(floatX, floatY, size, 0, Math.PI * 2)
      ctx.fill()
    })
  }

  const drawDistractionSpikes = (ctx: CanvasRenderingContext2D, pattern: GenerativePattern, elapsed: number) => {
    pattern.points.forEach(point => {
      const spike = Math.max(0, Math.sin(elapsed * pattern.speed + point.timestamp * 0.001)) * 100
      const x = point.x
      const y = point.y
      
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x, y - spike * point.intensity)
      ctx.lineWidth = 1 + point.intensity * 2
      ctx.stroke()
    })
  }

  // Productivity metrics overlay
  const ProductivityMetrics = () => (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-8 left-8 text-xs text-gray-400 dark:text-gray-600 font-mono">
        <div>Sessions: {sessionsCompleted}</div>
        <div>Focus Time: {Math.round(totalFocusTime / 60)}m</div>
        <div>Patterns: {patterns.length}</div>
        <div>State: {breathingState}</div>
      </div>
      
      {/* Data flow indicators */}
      <div className="absolute bottom-8 right-8 flex flex-col items-end text-xs text-gray-400 dark:text-gray-600 font-mono">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 bg-green-400 rounded-full opacity-50 animate-pulse"></div>
          Focus Flow
        </div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 bg-blue-400 rounded-full opacity-30"></div>
          Rest Patterns
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-red-400 rounded-full opacity-20"></div>
          Interruptions
        </div>
      </div>
    </div>
  )

  return (
    <div className="absolute inset-0 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ mixBlendMode: 'screen' }}
      />
      <ProductivityMetrics />
    </div>
  )
}

export default AmbientDataLayer