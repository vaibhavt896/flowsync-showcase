'use client'

import React, { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useGSAPWithCleanup } from '@/hooks/useAdvancedMemoryManager'
import { useConditionalLoad } from '@/hooks/useConditionalLoad'

/**
 * Complex Animations - GSAP integration with advanced effects
 * Higher GPU usage, loaded conditionally based on user interaction
 */

interface ComplexAnimationProps {
  children: React.ReactNode
  className?: string
  trigger?: boolean
}

export function MorphingShape({ className = '' }: { className?: string }) {
  const shapeRef = useRef<HTMLDivElement>(null)
  const { animate } = useGSAPWithCleanup()

  useEffect(() => {
    if (shapeRef.current) {
      const shapes = [
        'polygon(50% 0%, 0% 100%, 100% 100%)', // Triangle
        'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)', // Octagon
        'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)', // Diamond
        'circle(50%)', // Circle
        'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' // Square
      ]

      const morphTimeline = () => {
        shapes.forEach((shape, index) => {
          animate(shapeRef.current, {
            clipPath: shape,
            rotation: index * 72,
            scale: 1 + Math.sin(index) * 0.2,
            duration: 1.5,
            delay: index * 0.5,
            ease: 'power2.inOut'
          }, `morph-${index}`)
        })
      }

      const interval = setInterval(morphTimeline, 8000)
      morphTimeline() // Start immediately

      return () => clearInterval(interval)
    }
  }, [animate])

  return (
    <div
      ref={shapeRef}
      className={`complex-animation w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 ${className}`}
      style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
    />
  )
}

export function ParticleField({ className = '', particleCount = 50 }: { 
  className?: string
  particleCount?: number 
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { animate } = useGSAPWithCleanup()

  useEffect(() => {
    if (containerRef.current) {
      const particles: HTMLDivElement[] = []

      // Create particles
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div')
        particle.className = 'absolute w-1 h-1 bg-blue-400 rounded-full gpu-accelerated'
        particle.style.left = `${Math.random() * 100}%`
        particle.style.top = `${Math.random() * 100}%`
        
        containerRef.current.appendChild(particle)
        particles.push(particle)

        // Animate each particle
        animate(particle, {
          x: `+=${Math.random() * 200 - 100}`,
          y: `+=${Math.random() * 200 - 100}`,
          opacity: Math.random() * 0.8 + 0.2,
          scale: Math.random() * 0.5 + 0.5,
          duration: Math.random() * 3 + 2,
          repeat: -1,
          yoyo: true,
          ease: 'none'
        }, `particle-${i}`)
      }

      return () => {
        particles.forEach(particle => {
          if (particle.parentNode) {
            particle.parentNode.removeChild(particle)
          }
        })
      }
    }
  }, [animate, particleCount])

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden webgl-container ${className}`}
      style={{ height: '300px' }}
    />
  )
}

export function FluidBackground({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')!
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    class FluidParticle {
      x: number
      y: number
      vx: number
      vy: number
      radius: number
      color: string

      constructor() {
        this.x = Math.random() * (canvas?.width ?? 800)
        this.y = Math.random() * (canvas?.height ?? 600)
        this.vx = (Math.random() - 0.5) * 2
        this.vy = (Math.random() - 0.5) * 2
        this.radius = Math.random() * 3 + 1
        this.color = `hsl(${Math.random() * 60 + 200}, 70%, 60%)`
      }

      update() {
        this.x += this.vx
        this.y += this.vy

        if (this.x < 0 || this.x > (canvas?.width ?? 800)) this.vx *= -1
        if (this.y < 0 || this.y > (canvas?.height ?? 600)) this.vy *= -1
      }

      draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.globalAlpha = 0.6
        ctx.fill()
      }
    }

    const particles = Array.from({ length: 30 }, () => new FluidParticle())

    let animationId: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      particles.forEach(particle => {
        particle.update()
        particle.draw()
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationId) cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={`canvas-optimized ${className}`}
      style={{ width: '100%', height: '200px' }}
    />
  )
}

export function InteractiveWave({ 
  className = '',
  trigger = false 
}: ComplexAnimationProps) {
  const waveRef = useRef<HTMLDivElement>(null)
  const { animate } = useGSAPWithCleanup()

  useEffect(() => {
    if (waveRef.current && trigger) {
      animate(waveRef.current, {
        scaleX: [1, 1.5, 1],
        scaleY: [1, 0.7, 1],
        rotation: [0, 180, 360],
        duration: 2,
        ease: 'power2.inOut'
      }, 'wave-trigger')
    }
  }, [animate, trigger])

  return (
    <div
      ref={waveRef}
      className={`complex-animation w-32 h-32 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full ${className}`}
      style={{
        background: 'radial-gradient(circle, rgba(34,193,195,1) 0%, rgba(253,187,45,1) 100%)'
      }}
    />
  )
}

export function DynamicText({ 
  text, 
  className = '' 
}: { 
  text: string
  className?: string 
}) {
  const textRef = useRef<HTMLDivElement>(null)
  const { animate } = useGSAPWithCleanup()

  useEffect(() => {
    if (textRef.current) {
      const letters = textRef.current.querySelectorAll('span')
      
      letters.forEach((letter, index) => {
        animate(letter, {
          y: [0, -20, 0],
          color: ['#3b82f6', '#8b5cf6', '#06b6d4', '#3b82f6'],
          duration: 2,
          delay: index * 0.1,
          repeat: -1,
          ease: 'power2.inOut'
        }, `letter-${index}`)
      })
    }
  }, [animate, text])

  return (
    <div ref={textRef} className={`text-2xl font-bold ${className}`}>
      {text.split('').map((letter, index) => (
        <span key={index} className="inline-block gpu-accelerated">
          {letter === ' ' ? '\u00A0' : letter}
        </span>
      ))}
    </div>
  )
}

// Conditional loading wrapper for heavy animations
export function ConditionalComplexAnimation({ 
  children, 
  fallback 
}: { 
  children: React.ReactNode
  fallback?: React.ReactNode 
}) {
  const { Component, isLoading, recordInteraction } = useConditionalLoad(
    () => Promise.resolve({ default: () => <>{children}</> }),
    true,
    { 
      priority: 'low',
      threshold: 2,
      delay: 100
    }
  )

  return (
    <div 
      onMouseEnter={recordInteraction}
      onClick={recordInteraction}
      className="cursor-pointer"
    >
      {isLoading ? (
        fallback || <div className="w-full h-32 bg-gray-200 animate-pulse rounded" />
      ) : (
        Component && <Component />
      )}
    </div>
  )
}

const ComplexAnimations = {
  MorphingShape,
  ParticleField,
  FluidBackground,
  InteractiveWave,
  DynamicText,
  ConditionalComplexAnimation
}

export default ComplexAnimations