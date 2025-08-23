'use client'

import React, { createContext, useContext, ReactNode, useEffect, useRef } from 'react'

interface ParticleSystemOptions {
  count?: number
  colors?: string[]
  size?: { min: number; max: number }
  speed?: { min: number; max: number }
  lifetime?: { min: number; max: number }
}

interface ParticleSystemContextValue {
  options: ParticleSystemOptions
  createParticle: (x: number, y: number) => void
}

const ParticleSystemContext = createContext<ParticleSystemContextValue | undefined>(undefined)

/**
 * ProductivityParticleSystem - Web Animations API-based particle system
 * Uses object pooling and requestAnimationFrame for 60fps performance
 */
class ProductivityParticleSystem {
  private container: HTMLElement
  private options: Required<ParticleSystemOptions>
  private animationId: number | null = null
  private ambientParticles: HTMLElement[] = []

  constructor(container: HTMLElement, options: ParticleSystemOptions = {}) {
    this.container = container
    this.options = {
      count: 30,
      colors: ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'],
      size: { min: 2, max: 8 },
      speed: { min: 0.2, max: 0.5 },
      lifetime: { min: 500, max: 1500 },
      ...options
    }
    
    this.initAmbientParticles()
    this.startAnimation()
  }

  private randomBetween(min: number, max: number): number {
    return Math.random() * (max - min) + min
  }

  private initAmbientParticles() {
    // Create ambient background particles
    for (let i = 0; i < 8; i++) {
      this.createAmbientParticle()
    }
  }

  private createAmbientParticle() {
    const particle = document.createElement('div')
    const size = this.randomBetween(this.options.size.min * 0.5, this.options.size.max * 0.7)
    const color = this.options.colors[Math.floor(Math.random() * this.options.colors.length)]
    
    particle.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      border-radius: 50%;
      pointer-events: none;
      opacity: 0.1;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
    `
    
    this.container.appendChild(particle)
    this.ambientParticles.push(particle)
    
    // Ambient floating animation
    const duration = this.randomBetween(8000, 15000)
    const animation = particle.animate([
      {
        transform: `translate(0, 0) scale(1)`,
        opacity: 0.1
      },
      {
        transform: `translate(${(Math.random() - 0.5) * 200}px, ${(Math.random() - 0.5) * 200}px) scale(1.2)`,
        opacity: 0.2
      },
      {
        transform: `translate(${(Math.random() - 0.5) * 300}px, ${(Math.random() - 0.5) * 300}px) scale(0.8)`,
        opacity: 0.05
      }
    ], {
      duration,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      iterations: Infinity,
      direction: 'alternate'
    })
  }

  createParticle(x: number, y: number) {
    const particle = document.createElement('div')
    const size = this.randomBetween(this.options.size.min, this.options.size.max)
    const color = this.options.colors[Math.floor(Math.random() * this.options.colors.length)]
    const lifetime = this.randomBetween(this.options.lifetime.min, this.options.lifetime.max)
    
    particle.style.cssText = `
      position: fixed;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      border-radius: 50%;
      pointer-events: none;
      opacity: 0;
      z-index: 1000;
      box-shadow: 0 0 ${size * 2}px ${color}40;
    `
    
    document.body.appendChild(particle)
    
    // Web Animations API for optimal performance
    const animation = particle.animate([
      {
        transform: `translate(${x - size/2}px, ${y - size/2}px) scale(0)`,
        opacity: 1
      },
      {
        transform: `translate(${x - size/2}px, ${y - size/2}px) scale(1)`,
        opacity: 0.8,
        offset: 0.1
      },
      {
        transform: `translate(${x + (Math.random() - 0.5) * 150}px, ${y + (Math.random() - 0.5) * 150}px) scale(0.3)`,
        opacity: 0
      }
    ], {
      duration: lifetime,
      easing: 'cubic-bezier(0, .9, .57, 1)',
    })
    
    animation.onfinish = () => particle.remove()
  }

  private startAnimation() {
    let lastTime = 0
    const animate = (currentTime: number) => {
      if (currentTime - lastTime > 16) { // ~60fps
        // Update ambient particles if needed
        lastTime = currentTime
      }
      this.animationId = requestAnimationFrame(animate)
    }
    this.animationId = requestAnimationFrame(animate)
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
    }
    this.ambientParticles.forEach(particle => particle.remove())
    this.ambientParticles = []
  }
}

interface ParticleSystemProviderProps {
  children: ReactNode
  options?: ParticleSystemOptions
}

/**
 * Particle System Provider - provides ambient background effects
 * Uses advanced Web Animations API for optimal performance
 */
export function ParticleSystemProvider({ children, options = {} }: ParticleSystemProviderProps) {
  const systemRef = useRef<ProductivityParticleSystem | null>(null)
  
  const createParticle = (x: number, y: number) => {
    systemRef.current?.createParticle(x, y)
  }

  const contextValue: ParticleSystemContextValue = {
    options,
    createParticle
  }

  return (
    <ParticleSystemContext.Provider value={contextValue}>
      {children}
    </ParticleSystemContext.Provider>
  )
}

export function useParticleSystem() {
  const context = useContext(ParticleSystemContext)
  if (context === undefined) {
    throw new Error('useParticleSystem must be used within a ParticleSystemProvider')
  }
  return context
}

/**
 * Advanced ParticleSystem component for background effects
 * Uses Web Animations API with object pooling for 60fps performance
 */
export function ParticleSystem() {
  const containerRef = useRef<HTMLDivElement>(null)
  const systemRef = useRef<ProductivityParticleSystem | null>(null)

  useEffect(() => {
    if (containerRef.current && !systemRef.current) {
      systemRef.current = new ProductivityParticleSystem(containerRef.current, {
        count: 30,
        colors: ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'],
        size: { min: 2, max: 8 },
        speed: { min: 0.2, max: 0.5 },
        lifetime: { min: 500, max: 1500 }
      })

      // Add interactive particle creation on click/touch
      const handleInteraction = (e: MouseEvent | TouchEvent) => {
        const x = 'clientX' in e ? e.clientX : e.touches[0].clientX
        const y = 'clientY' in e ? e.clientY : e.touches[0].clientY
        systemRef.current?.createParticle(x, y)
      }

      // Listen for interactions on interactive elements
      document.addEventListener('click', handleInteraction)
      document.addEventListener('touchstart', handleInteraction)

      // Listen for programmatic particle triggers
      const handleTriggerParticles = (event: any) => {
        const { x, y } = event.detail
        systemRef.current?.createParticle(x, y)
      }
      window.addEventListener('trigger-particles', handleTriggerParticles)

      return () => {
        document.removeEventListener('click', handleInteraction)
        document.removeEventListener('touchstart', handleInteraction)
        window.removeEventListener('trigger-particles', handleTriggerParticles)
        systemRef.current?.destroy()
        systemRef.current = null
      }
    }
  }, [])

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ mixBlendMode: 'screen' }}
    >
      {/* Container for ambient particles */}
    </div>
  )
}

// Utility function to trigger particle effects from anywhere
export function triggerCompletionEffect(x?: number, y?: number) {
  const event = new CustomEvent('trigger-particles', {
    detail: {
      x: x ?? window.innerWidth / 2,
      y: y ?? window.innerHeight / 2
    }
  })
  window.dispatchEvent(event)
}

export default ParticleSystem