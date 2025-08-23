/**
 * The Focus Vortex
 * Starting a session creates a vortex effect where all UI elements spiral into the timer
 * Creates sense of entering another dimension
 */

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion'
import { useTimerStore } from '@/stores/timerStore'
import { useNavigationStore } from '@/stores/navigationStore'
import { ParticleSystem, Particle, VortexForce, AnimationController, Vector3 } from '@/systems/physicsEngine'
import { AdaptiveChromatics } from '@/systems/adaptiveChromatics'

interface VortexState {
  isActive: boolean
  intensity: number // 0-1 based on session type and duration
  phase: 'preparation' | 'spiral' | 'absorption' | 'emergence' | 'idle'
  direction: 'inward' | 'outward' // inward for session start, outward for break
}

interface UIElement {
  id: string
  element: HTMLElement
  originalPosition: DOMRect
  vortexPosition: Vector3
  absorbed: boolean
}

export default function FocusVortex() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const vortexCenterRef = useRef<HTMLDivElement>(null)
  
  const { currentSession, isRunning } = useTimerStore()
  const { currentState, isTransitioning } = useNavigationStore()
  
  const [chromatics] = useState(() => new AdaptiveChromatics())
  const [particleSystem] = useState(() => new ParticleSystem(200))
  const [animationController] = useState(() => new AnimationController(60))
  
  const [vortexState, setVortexState] = useState<VortexState>({
    isActive: false,
    intensity: 0,
    phase: 'idle',
    direction: 'inward'
  })
  
  const [uiElements, setUIElements] = useState<UIElement[]>([])
  
  // Motion values for vortex control
  const vortexProgress = useMotionValue(0)
  const rotationSpeed = useTransform(vortexProgress, [0, 1], [0, 720])
  const suction = useTransform(vortexProgress, [0, 1], [0, 200])
  
  // Detect session start/stop to trigger vortex
  useEffect(() => {
    if (currentSession && isRunning && !vortexState.isActive) {
      // Session started - trigger inward vortex
      startVortex('inward', getSessionIntensity(currentSession.type))
    } else if (!isRunning && vortexState.isActive) {
      // Session stopped - trigger outward vortex (return)
      startVortex('outward', 0.7)
    }
  }, [currentSession, isRunning])
  
  const getSessionIntensity = (sessionType: string): number => {
    switch (sessionType) {
      case 'focus': return 1.0
      case 'long-break': return 0.3
      case 'short-break': return 0.5
      default: return 0.7
    }
  }
  
  const startVortex = (direction: 'inward' | 'outward', intensity: number) => {
    // Capture all UI elements before they get absorbed
    captureUIElements()
    
    setVortexState({
      isActive: true,
      intensity,
      phase: 'preparation',
      direction
    })
    
    // Start the vortex sequence
    executeVortexSequence(direction, intensity)
  }
  
  const captureUIElements = () => {
    const elements: UIElement[] = []
    
    // Find all interactive UI elements
    const selectors = [
      '.organism-nav',
      '.timer-controls',
      '.productivity-metrics',
      '.flow-indicators',
      '[data-vortex-capture]' // Allow manual tagging
    ]
    
    selectors.forEach(selector => {
      const foundElements = document.querySelectorAll(selector)
      foundElements.forEach((el, index) => {
        if (el instanceof HTMLElement) {
          const bounds = el.getBoundingClientRect()
          const center = getVortexCenter()
          
          elements.push({
            id: `${selector}-${index}`,
            element: el,
            originalPosition: bounds,
            vortexPosition: {
              x: bounds.left + bounds.width / 2,
              y: bounds.top + bounds.height / 2,
              z: 0
            },
            absorbed: false
          })
        }
      })
    })
    
    setUIElements(elements)
  }
  
  const getVortexCenter = (): Vector3 => {
    if (vortexCenterRef.current) {
      const bounds = vortexCenterRef.current.getBoundingClientRect()
      return {
        x: bounds.left + bounds.width / 2,
        y: bounds.top + bounds.height / 2,
        z: 0
      }
    }
    return { x: window.innerWidth / 2, y: window.innerHeight / 2, z: 0 }
  }
  
  const executeVortexSequence = async (direction: 'inward' | 'outward', intensity: number) => {
    const duration = intensity * 2000 + 1000 // 1-3 seconds based on intensity
    
    // Phase 1: Preparation (200ms)
    setVortexState(prev => ({ ...prev, phase: 'preparation' }))
    await new Promise(resolve => setTimeout(resolve, 200))
    
    // Phase 2: Spiral (main vortex)
    setVortexState(prev => ({ ...prev, phase: 'spiral' }))
    
    if (direction === 'inward') {
      // Elements spiral into center
      vortexProgress.set(0)
      await new Promise(resolve => {
        const animation = vortexProgress.onChange((value) => {
          if (value >= 1) {
            animation()
            resolve()
          }
        })
        vortexProgress.set(1)
      })
      
      // Phase 3: Absorption
      setVortexState(prev => ({ ...prev, phase: 'absorption' }))
      await new Promise(resolve => setTimeout(resolve, 400))
      
    } else {
      // Elements emerge from center
      setVortexState(prev => ({ ...prev, phase: 'emergence' }))
      vortexProgress.set(1)
      await new Promise(resolve => {
        const animation = vortexProgress.onChange((value) => {
          if (value <= 0) {
            animation()
            resolve()
          }
        })
        vortexProgress.set(0)
      })
    }
    
    // End vortex
    setVortexState({
      isActive: false,
      intensity: 0,
      phase: 'idle',
      direction: 'inward'
    })
  }
  
  // Initialize particle system
  useEffect(() => {
    if (!canvasRef.current) return
    
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const center = getVortexCenter()
    
    // Clear existing particles
    particleSystem.particles = []
    
    // Create vortex particles
    for (let i = 0; i < 150; i++) {
      const angle = (i / 150) * Math.PI * 2
      const radius = Math.random() * 300 + 100
      const x = center.x + Math.cos(angle) * radius
      const y = center.y + Math.sin(angle) * radius
      
      const particle = new Particle(
        { x, y, z: Math.random() * 50 },
        {
          x: Math.cos(angle + Math.PI / 2) * 2,
          y: Math.sin(angle + Math.PI / 2) * 2,
          z: 0
        },
        Math.random() * 3 + 2, // life
        Math.random() * 2 + 1, // size
        chromatics.getColor(currentSession?.type === 'focus' ? 'focus' : 'flow')
      )
      
      particleSystem.addParticle(particle)
    }
    
    // Add vortex force
    const vortexForce = new VortexForce(
      center,
      vortexState.intensity * 50,
      500
    )
    particleSystem.addForce(vortexForce)
    
  }, [vortexState.isActive, vortexState.intensity])
  
  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth * devicePixelRatio
      canvas.height = window.innerHeight * devicePixelRatio
      ctx.scale(devicePixelRatio, devicePixelRatio)
    }
    
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    
    const render = (deltaTime: number) => {
      if (!vortexState.isActive) return
      
      // Update particle system
      particleSystem.update(deltaTime / 1000)
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width / devicePixelRatio, canvas.height / devicePixelRatio)
      
      // Render vortex effect
      renderVortexField(ctx)
      renderParticles(ctx)
      renderDimensionalRift(ctx)
    }
    
    animationController.start(render)
    
    return () => {
      animationController.stop()
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [vortexState, particleSystem, animationController])
  
  const renderVortexField = (ctx: CanvasRenderingContext2D) => {
    const center = getVortexCenter()
    const progress = vortexProgress.get()
    
    // Render spiral energy field
    ctx.save()
    ctx.globalCompositeOperation = 'screen'
    
    const spirals = 3
    for (let s = 0; s < spirals; s++) {
      const spiral = ctx.createRadialGradient(
        center.x, center.y, 0,
        center.x, center.y, 400
      )
      
      const hue = 200 + s * 30
      spiral.addColorStop(0, `hsla(${hue}, 70%, 60%, 0.8)`)
      spiral.addColorStop(0.5, `hsla(${hue}, 50%, 40%, 0.4)`)
      spiral.addColorStop(1, `hsla(${hue}, 30%, 20%, 0)`)
      
      ctx.fillStyle = spiral
      ctx.beginPath()
      
      const rotation = (Date.now() * 0.001 + s * 120) * vortexState.intensity
      const points = 50
      
      for (let i = 0; i <= points; i++) {
        const angle = (i / points) * Math.PI * 4 + rotation
        const radius = (i / points) * 300 * (1 - progress * 0.8)
        const x = center.x + Math.cos(angle) * radius
        const y = center.y + Math.sin(angle) * radius
        
        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }
      
      ctx.fill()
    }
    
    ctx.restore()
  }
  
  const renderParticles = (ctx: CanvasRenderingContext2D) => {
    const particles = particleSystem.getParticleData()
    const progress = vortexProgress.get()
    
    particles.forEach((particle, index) => {
      ctx.save()
      ctx.globalAlpha = particle.opacity * 0.8
      
      // Color based on distance from center and progress
      const center = getVortexCenter()
      const distance = Math.sqrt(
        Math.pow(particle.x - center.x, 2) + 
        Math.pow(particle.y - center.y, 2)
      )
      
      const hue = 200 + (distance / 300) * 80 + progress * 40
      ctx.fillStyle = `hsl(${hue}, 70%, 60%)`
      
      // Particle trail effect
      if (vortexState.phase === 'spiral') {
        ctx.shadowBlur = 15
        ctx.shadowColor = ctx.fillStyle
      }
      
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      ctx.fill()
      
      ctx.restore()
    })
  }
  
  const renderDimensionalRift = (ctx: CanvasRenderingContext2D) => {
    if (vortexState.phase !== 'absorption' && vortexState.phase !== 'emergence') return
    
    const center = getVortexCenter()
    const intensity = vortexState.intensity
    
    // Render dimensional portal
    ctx.save()
    ctx.globalCompositeOperation = 'screen'
    
    const riftGradient = ctx.createRadialGradient(
      center.x, center.y, 0,
      center.x, center.y, 100 * intensity
    )
    
    riftGradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)')
    riftGradient.addColorStop(0.3, 'rgba(100, 200, 255, 0.6)')
    riftGradient.addColorStop(0.7, 'rgba(200, 100, 255, 0.3)')
    riftGradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
    
    ctx.fillStyle = riftGradient
    ctx.beginPath()
    ctx.arc(center.x, center.y, 80 * intensity, 0, Math.PI * 2)
    ctx.fill()
    
    ctx.restore()
  }
  
  if (!vortexState.isActive) return null
  
  return (
    <div className="fixed inset-0 z-[1000] pointer-events-none">
      {/* Vortex center reference */}
      <div
        ref={vortexCenterRef}
        className="absolute left-1/2 top-1/2 w-1 h-1"
        style={{ transform: 'translate(-50%, -50%)' }}
      />
      
      {/* Vortex canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{
          mixBlendMode: 'screen',
          filter: `blur(${vortexState.phase === 'absorption' ? '2px' : '0px'})`
        }}
      />
      
      {/* UI Elements being absorbed/emerging */}
      <AnimatePresence>
        {uiElements.map((uiElement) => (
          <VortexUIElement
            key={uiElement.id}
            uiElement={uiElement}
            vortexCenter={getVortexCenter()}
            progress={vortexProgress}
            direction={vortexState.direction}
            phase={vortexState.phase}
          />
        ))}
      </AnimatePresence>
      
      {/* Dimensional overlay effects */}
      {vortexState.phase === 'absorption' && (
        <motion.div
          className="absolute inset-0 bg-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        />
      )}
      
      {/* Session intensity indicator */}
      <motion.div
        className="absolute top-4 right-4 text-white/80 font-mono text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div>Vortex Intensity: {Math.round(vortexState.intensity * 100)}%</div>
        <div>Phase: {vortexState.phase}</div>
        <div className="text-xs text-white/60 mt-1">
          {vortexState.direction === 'inward' ? '→ Entering Focus Dimension' : '← Returning to Reality'}
        </div>
      </motion.div>
      
      {/* Breathing guide during absorption */}
      {vortexState.phase === 'absorption' && (
        <motion.div
          className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: 1, 
            scale: [0.8, 1.1, 1],
          }}
          transition={{ duration: 1.5 }}
        >
          <motion.div
            className="text-2xl mb-2"
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            🌌
          </motion.div>
          <div className="text-lg font-light">Entering Deep Focus</div>
          <div className="text-sm text-white/60 mt-2">Take a deep breath and let go</div>
        </motion.div>
      )}
    </div>
  )
}

/**
 * Individual UI element being absorbed into vortex
 */
function VortexUIElement({
  uiElement,
  vortexCenter,
  progress,
  direction,
  phase
}: {
  uiElement: UIElement
  vortexCenter: Vector3
  progress: any
  direction: 'inward' | 'outward'
  phase: string
}) {
  const elementProgress = useTransform(progress, [0, 1], direction === 'inward' ? [0, 1] : [1, 0])
  
  const x = useTransform(elementProgress, [0, 1], [
    uiElement.originalPosition.left,
    vortexCenter.x - uiElement.originalPosition.width / 2
  ])
  
  const y = useTransform(elementProgress, [0, 1], [
    uiElement.originalPosition.top,
    vortexCenter.y - uiElement.originalPosition.height / 2
  ])
  
  const scale = useTransform(elementProgress, [0, 0.8, 1], [1, 0.5, 0])
  const rotate = useTransform(elementProgress, [0, 1], [0, 720])
  const opacity = useTransform(elementProgress, [0, 0.7, 1], [1, 0.3, 0])
  
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: x,
        top: y,
        scale,
        rotate,
        opacity,
        transformOrigin: 'center',
        filter: `blur(${useTransform(elementProgress, [0, 1], [0, 4])}px)`,
      }}
      transition={{
        type: "spring",
        damping: 25,
        stiffness: 120
      }}
    >
      <div 
        className="transform-gpu"
        style={{
          width: uiElement.originalPosition.width,
          height: uiElement.originalPosition.height,
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '8px',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}
      >
        {/* Ghost representation of UI element */}
        <div className="w-full h-full bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-lg" />
      </div>
    </motion.div>
  )
}