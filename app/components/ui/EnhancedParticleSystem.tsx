'use client'

import React, { createContext, useContext, ReactNode, useEffect, useRef, useCallback } from 'react'
import { useAdvancedMemoryManager } from '@/hooks/useAdvancedMemoryManager'

interface ParticleConfig {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  life: number
  maxLife: number
  opacity: number
  rotation: number
  rotationSpeed: number
}

interface EnhancedParticleSystemOptions {
  count?: number
  maxParticles?: number
  colors?: string[]
  size?: { min: number; max: number }
  speed?: { min: number; max: number }
  lifetime?: { min: number; max: number }
  enablePhysics?: boolean
  enableCollisions?: boolean
  particleShape?: 'circle' | 'square' | 'triangle'
  blendMode?: 'normal' | 'multiply' | 'screen' | 'overlay'
}

interface ParticleSystemContextValue {
  options: EnhancedParticleSystemOptions
  createBurst: (x: number, y: number, intensity?: number) => void
  setParticleCount: (count: number) => void
  getPerformanceStats: () => { fps: number; particleCount: number; poolSize: number }
}

const ParticleSystemContext = createContext<ParticleSystemContextValue | undefined>(undefined)

/**
 * Enhanced Particle System with Object Pooling
 * Supports 100+ particles at 60fps through efficient memory management
 */
class EnhancedParticleSystem {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private options: Required<EnhancedParticleSystemOptions>
  private particles: ParticleConfig[] = []
  private particlePool: ParticleConfig[] = []
  private animationId: number | null = null
  private lastTime = 0
  private frameCount = 0
  private fps = 60
  private memoryManager: any

  // Performance optimization flags
  private useOffscreenCanvas = false
  private useWebGL = false
  private batchedUpdates = true
  private enableCulling = true

  constructor(
    canvas: HTMLCanvasElement,
    options: EnhancedParticleSystemOptions = {},
    memoryManager?: any
  ) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')!
    this.memoryManager = memoryManager

    this.options = {
      count: 50,
      maxParticles: 150,
      colors: ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'],
      size: { min: 2, max: 12 },
      speed: { min: 0.5, max: 2.5 },
      lifetime: { min: 1000, max: 4000 },
      enablePhysics: true,
      enableCollisions: false,
      particleShape: 'circle',
      blendMode: 'normal',
      ...options
    }

    this.initializeCanvas()
    this.initializeParticlePool()
    this.setupOptimizations()
    this.startAnimation()
  }

  private initializeCanvas(): void {
    const updateCanvasSize = () => {
      const rect = this.canvas.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      
      this.canvas.width = rect.width * dpr
      this.canvas.height = rect.height * dpr
      
      this.ctx.scale(dpr, dpr)
      this.canvas.style.width = `${rect.width}px`
      this.canvas.style.height = `${rect.height}px`
    }

    updateCanvasSize()
    
    // Register resize listener with memory manager
    if (this.memoryManager) {
      this.memoryManager.addEventListener(window, 'resize', updateCanvasSize)
    } else {
      window.addEventListener('resize', updateCanvasSize)
    }
  }

  private setupOptimizations(): void {
    // Check for OffscreenCanvas support
    this.useOffscreenCanvas = 'OffscreenCanvas' in window

    // Set optimized canvas properties
    this.ctx.imageSmoothingEnabled = false // Disable for pixel-perfect rendering
    
    // Set blend mode
    this.ctx.globalCompositeOperation = this.options.blendMode as GlobalCompositeOperation
  }

  private initializeParticlePool(): void {
    // Pre-allocate particle objects to avoid GC pressure
    for (let i = 0; i < this.options.maxParticles; i++) {
      this.particlePool.push(this.createParticleConfig(0, 0))
    }
  }

  private createParticleConfig(x: number, y: number): ParticleConfig {
    const size = this.randomBetween(this.options.size.min, this.options.size.max)
    const speed = this.randomBetween(this.options.speed.min, this.options.speed.max)
    const angle = Math.random() * Math.PI * 2
    const maxLife = this.randomBetween(this.options.lifetime.min, this.options.lifetime.max)

    return {
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size,
      color: this.options.colors[Math.floor(Math.random() * this.options.colors.length)],
      life: maxLife,
      maxLife,
      opacity: 1,
      rotation: 0,
      rotationSpeed: this.randomBetween(-0.02, 0.02)
    }
  }

  private randomBetween(min: number, max: number): number {
    return Math.random() * (max - min) + min
  }

  private getParticleFromPool(x: number, y: number): ParticleConfig | null {
    const particle = this.particlePool.pop()
    if (particle) {
      // Reset particle properties
      const config = this.createParticleConfig(x, y)
      Object.assign(particle, config)
      return particle
    }
    return null
  }

  private returnParticleToPool(particle: ParticleConfig): void {
    if (this.particlePool.length < this.options.maxParticles) {
      this.particlePool.push(particle)
    }
  }

  public createBurst(x: number, y: number, intensity = 10): void {
    for (let i = 0; i < intensity; i++) {
      if (this.particles.length < this.options.maxParticles) {
        const particle = this.getParticleFromPool(x, y)
        if (particle) {
          // Add some randomness to burst position
          particle.x = x + this.randomBetween(-20, 20)
          particle.y = y + this.randomBetween(-20, 20)
          this.particles.push(particle)
        }
      }
    }
  }

  private updateParticles(deltaTime: number): void {
    const dt = deltaTime / 16.67 // Normalize to 60fps

    // Batch update particles for better performance
    if (this.batchedUpdates) {
      this.updateParticlesBatched(dt)
    } else {
      this.updateParticlesIndividual(dt)
    }

    // Remove dead particles and return to pool
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i]
      
      if (particle.life <= 0) {
        this.returnParticleToPool(particle)
        this.particles.splice(i, 1)
      }
    }
  }

  private updateParticlesBatched(dt: number): void {
    const canvasWidth = this.canvas.width
    const canvasHeight = this.canvas.height

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i]
      
      // Physics update
      if (this.options.enablePhysics) {
        p.vy += 0.01 * dt // Gravity
        p.vx *= 0.99 // Air resistance
        p.vy *= 0.99
      }

      // Position update
      p.x += p.vx * dt
      p.y += p.vy * dt
      p.rotation += p.rotationSpeed * dt

      // Life update
      p.life -= dt * 16.67
      p.opacity = p.life / p.maxLife

      // Boundary handling with culling
      if (this.enableCulling) {
        if (p.x < -p.size || p.x > canvasWidth + p.size || 
            p.y < -p.size || p.y > canvasHeight + p.size) {
          p.life = 0 // Mark for removal
        }
      }
    }
  }

  private updateParticlesIndividual(dt: number): void {
    this.particles.forEach(particle => {
      // Individual particle update (less efficient but more flexible)
      particle.x += particle.vx * dt
      particle.y += particle.vy * dt
      particle.rotation += particle.rotationSpeed * dt
      particle.life -= dt * 16.67
      particle.opacity = Math.max(0, particle.life / particle.maxLife)
    })
  }

  private renderParticles(): void {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    // Batch render particles
    this.particles.forEach(particle => {
      if (particle.opacity <= 0) return

      this.ctx.save()
      this.ctx.globalAlpha = particle.opacity
      this.ctx.translate(particle.x, particle.y)
      this.ctx.rotate(particle.rotation)

      this.renderParticleShape(particle)
      
      this.ctx.restore()
    })
  }

  private renderParticleShape(particle: ParticleConfig): void {
    const { size, color } = particle
    const halfSize = size / 2

    this.ctx.fillStyle = color

    switch (this.options.particleShape) {
      case 'circle':
        this.ctx.beginPath()
        this.ctx.arc(0, 0, halfSize, 0, Math.PI * 2)
        this.ctx.fill()
        break

      case 'square':
        this.ctx.fillRect(-halfSize, -halfSize, size, size)
        break

      case 'triangle':
        this.ctx.beginPath()
        this.ctx.moveTo(0, -halfSize)
        this.ctx.lineTo(-halfSize, halfSize)
        this.ctx.lineTo(halfSize, halfSize)
        this.ctx.closePath()
        this.ctx.fill()
        break
    }
  }

  private animate = (currentTime: number): void => {
    const deltaTime = currentTime - this.lastTime
    this.lastTime = currentTime

    // Calculate FPS
    this.frameCount++
    if (this.frameCount % 60 === 0) {
      this.fps = Math.round(1000 / (deltaTime || 16.67))
    }

    // Update and render
    this.updateParticles(deltaTime)
    this.renderParticles()

    // Continue animation loop
    this.animationId = requestAnimationFrame(this.animate)

    // Register with memory manager
    if (this.memoryManager && this.animationId) {
      this.memoryManager.registerRAF(this.animationId, 'particle-system')
    }
  }

  private startAnimation(): void {
    this.lastTime = performance.now()
    this.animationId = requestAnimationFrame(this.animate)
  }

  public setParticleCount(count: number): void {
    this.options.count = Math.min(count, this.options.maxParticles)
  }

  public getPerformanceStats() {
    return {
      fps: this.fps,
      particleCount: this.particles.length,
      poolSize: this.particlePool.length,
      memoryUsage: this.particles.length + this.particlePool.length
    }
  }

  public destroy(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
      this.animationId = null
    }
    
    // Return all active particles to pool
    this.particles.forEach(particle => this.returnParticleToPool(particle))
    this.particles = []
    this.particlePool = []
  }
}

export function EnhancedParticleSystemProvider({ 
  children, 
  options 
}: { 
  children: ReactNode
  options?: EnhancedParticleSystemOptions 
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const systemRef = useRef<EnhancedParticleSystem | null>(null)
  const memoryManager = useAdvancedMemoryManager({ debugMode: false })

  useEffect(() => {
    if (canvasRef.current && !systemRef.current) {
      systemRef.current = new EnhancedParticleSystem(
        canvasRef.current,
        options,
        memoryManager
      )
    }

    return () => {
      if (systemRef.current) {
        systemRef.current.destroy()
        systemRef.current = null
      }
    }
  }, [options, memoryManager])

  const createBurst = useCallback((x: number, y: number, intensity?: number) => {
    systemRef.current?.createBurst(x, y, intensity)
  }, [])

  const setParticleCount = useCallback((count: number) => {
    systemRef.current?.setParticleCount(count)
  }, [])

  const getPerformanceStats = useCallback(() => {
    return systemRef.current?.getPerformanceStats() || { fps: 0, particleCount: 0, poolSize: 0 }
  }, [])

  const contextValue: ParticleSystemContextValue = {
    options: options || {},
    createBurst,
    setParticleCount,
    getPerformanceStats
  }

  return (
    <ParticleSystemContext.Provider value={contextValue}>
      <div className="relative w-full h-full">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none z-10"
          style={{ mixBlendMode: options?.blendMode || 'normal' }}
        />
        {children}
      </div>
    </ParticleSystemContext.Provider>
  )
}

export function useEnhancedParticleSystem() {
  const context = useContext(ParticleSystemContext)
  if (!context) {
    throw new Error('useEnhancedParticleSystem must be used within EnhancedParticleSystemProvider')
  }
  return context
}

// Trigger particle burst on completion
export function triggerEnhancedCompletionEffect(x?: number, y?: number) {
  const event = new CustomEvent('enhanced-particle-burst', {
    detail: { 
      x: x || window.innerWidth / 2, 
      y: y || window.innerHeight / 2,
      intensity: 25
    }
  })
  window.dispatchEvent(event)
}

export default EnhancedParticleSystemProvider